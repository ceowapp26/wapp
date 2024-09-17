import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { projectStructure, configurations } = await req.json();

        const octokit = new Octokit({ auth: configurations.GITHUB_TOKEN });

        const sendUpdate = async (step, status, extra = {}) => {
          controller.enqueue(encoder.encode(JSON.stringify({ step, status, ...extra }) + '\n'));
        };

        // Clear existing resources
        await clearExistingResources(configurations, octokit);

        // Step 1: Create GitHub repository and push code
        await sendUpdate('push', 'pending');
        const { repoUrl, githubStatus } = await createGitHubRepoAndPushCode(projectStructure, configurations, octokit);
        await sendUpdate('push', githubStatus);

        // Step 2: Dynamic deployment based on chosen platform
        if (githubStatus === 'success') {
          const deployResult = await dynamicDeploy(repoUrl, configurations, sendUpdate);
          if (deployResult.status === 'success') {
            await dynamicBuild(deployResult.deploymentId, configurations, sendUpdate);
          }
        }

        controller.close();
      } catch (error) {
        console.error('Error in compile-and-deploy:', error);
        controller.enqueue(encoder.encode(JSON.stringify({ error: 'Failed to compile and deploy', details: error.message })));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function dynamicDeploy(repoUrl, configurations, sendUpdate) {
  switch (configurations.platform.toLowerCase()) {
    case 'vercel':
      await sendUpdate('deploy', 'pending');
      const { deploymentId, vercelStatus: deployStatus, error: deployError } = await deployToVercel(repoUrl, configurations);
      await sendUpdate('deploy', deployStatus, { error: deployError });
      return { status: deployStatus, deploymentId };
    case 'railway':
      // Implement Railway deployment logic here
      break;
    default:
      throw new Error(`Unsupported platform: ${configurations.platform}`);
  }
}

async function dynamicBuild(deploymentId, configurations, sendUpdate) {
  switch (configurations.platform.toLowerCase()) {
    case 'vercel':
      await sendUpdate('build', 'pending');
      const { deploymentUrl, vercelStatus: buildStatus, error: buildError } = await buildOnVercel(deploymentId, configurations);
      await sendUpdate('build', buildStatus, { deploymentUrl, error: buildError });
      return { status: buildStatus, deploymentUrl };
    case 'railway':
      // Implement Railway build logic here
      break;
    default:
      throw new Error(`Unsupported platform: ${configurations.platform}`);
  }
}

async function clearExistingResources(configurations, octokit) {
  // Delete GitHub repo if exists
  try {
    await octokit.repos.delete({
      owner: configurations.GITHUB_USERNAME,
      repo: `project-${configurations.projectId}`,
    });
  } catch (error) {
    // Ignore if repo doesn't exist
  }

  // Delete Vercel project if exists
  try {
    const projectsResponse = await fetch(`https://api.vercel.com/v9/projects`, {
      headers: { 'Authorization': `Bearer ${configurations.VERCEL_TOKEN}` },
    });
    const projects = await projectsResponse.json();
    const existingProject = projects.projects.find(p => p.name === `project-${configurations.projectId}`);
    if (existingProject) {
      await fetch(`https://api.vercel.com/v9/projects/${existingProject.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${configurations.VERCEL_TOKEN}` },
      });
    }
  } catch (error) {
    // Ignore if project doesn't exist
  }
}

async function createGitHubRepoAndPushCode(projectStructure, configurations, octokit) {
  try {
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: `project-${configurations.projectId}`,
      private: true,
    });

    async function createOrUpdateFile(path, content) {
      await octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: repo.name,
        path,
        message: configurations.commitMessage || `Add ${path}`,
        content: Base64.encode(content),
        branch: configurations.branch || 'main',
      });
    }

    async function pushFiles(structure, currentPath = '') {
      for (const [key, value] of Object.entries(structure)) {
        const newPath = currentPath ? `${currentPath}/${key}` : key;
        
        if (typeof value === 'string') {
          // It's a file, push it
          await createOrUpdateFile(newPath, value);
        } else if (typeof value === 'object' && value !== null) {
          // It's a directory, recurse
          await pushFiles(value, newPath);
        }
      }
    }

    await pushFiles(projectStructure);

    return { repoUrl: repo.html_url, githubStatus: 'success' };
  } catch (error) {
    console.error('Error creating GitHub repo or pushing code:', error);
    return { repoUrl: null, githubStatus: 'failed' };
  }
}

async function deployToVercel(repoUrl, configurations) {
  try {
    // Step 1: Create a new project
    const createProjectResponse = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${configurations.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `project-${configurations.projectId}`,
        gitRepository: {
          type: 'github',
          repo: repoUrl.split('github.com/')[1],
        },
        framework: configurations.framework || 'nextjs',
        buildCommand: configurations.buildCommand,
        devCommand: configurations.devCommand,
        installCommand: configurations.installCommand,
        outputDirectory: configurations.outputDirectory,
      }),
    });

    if (!createProjectResponse.ok) {
      throw new Error(`Failed to create project: ${await createProjectResponse.text()}`);
    }

    const projectData = await createProjectResponse.json();

    // Step 2: Get repository details from GitHub
    const [owner, repo] = repoUrl.split('github.com/')[1].split('/');
    const repoDetailsResponse = await octokit.repos.get({
      owner,
      repo,
    });

    if (!repoDetailsResponse.data.id) {
      throw new Error('Failed to get repository ID from GitHub');
    }

    const repoId = repoDetailsResponse.data.id.toString();

    // Step 3: Create a new deployment
    const deployResponse = await fetch(`https://api.vercel.com/v13/deployments?forceNew=1&skipAutoDetectionConfirmation=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${configurations.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `project-${configurations.projectId}`,
        deploymentId: configurations.projectId,
        project: projectData.id,
        target: 'production',
        gitSource: {
          type: 'github',
          repo: repoUrl.split('github.com/')[1],
          ref: configurations.branch || 'main',
          repoId: repoId,
        },
        projectSettings: {
          framework: configurations.framework || 'nextjs',
          nodeVersion: configurations.nodeVersion || '20.x',
        },
      }),
    });

    if (!deployResponse.ok) {
      throw new Error(`Failed to create deployment: ${await deployResponse.text()}`);
    }

    const deployData = await deployResponse.json();

    return { deploymentId: deployData.id, vercelStatus: 'success' };
  } catch (error) {
    console.error('Error deploying to Vercel:', error);
    return { deploymentId: null, vercelStatus: 'failed', error: error.message };
  }
}

async function buildOnVercel(deploymentId, configurations) {
  try {
    let deploymentStatus = 'INITIALIZING';
    let deploymentUrl = '';
    let attempts = 0;
    const maxAttempts = configurations.maxBuildAttempts || 60; // 5 minutes maximum waiting time
    
    while (['QUEUED', 'INITIALIZING', 'ANALYZING', 'BUILDING'].includes(deploymentStatus) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

      const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${configurations.VERCEL_TOKEN}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to get deployment status: ${await statusResponse.text()}`);
      }

      const statusData = await statusResponse.json();
      deploymentStatus = statusData.readyState;
      deploymentUrl = statusData.url || deploymentUrl;
      attempts++;
    }

    if (deploymentStatus === 'READY') {
      return { deploymentUrl: `https://${deploymentUrl}`, vercelStatus: 'success' };
    } else if (attempts >= maxAttempts) {
      throw new Error(`Deployment timed out after ${maxAttempts * 5} seconds`);
    } else {
      // Fetch detailed error information
      const errorResponse = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${configurations.VERCEL_TOKEN}`,
        },
      });
      const errorData = await errorResponse.json();
      console.error('Deployment error details:', JSON.stringify(errorData, null, 2));
      throw new Error(`Deployment failed with status: ${deploymentStatus}. Check console for details.`);
    }
  } catch (error) {
    console.error('Error building on Vercel:', error);
    return { deploymentUrl: null, vercelStatus: 'failed', error: error.message };
  }
}