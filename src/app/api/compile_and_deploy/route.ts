import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const vercelToken = process.env.VERCEL_TOKEN;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { projectStructure, projectId } = await req.json();

        const sendUpdate = async (step, status, extra = {}) => {
          controller.enqueue(encoder.encode(JSON.stringify({ step, status, ...extra }) + '\n'));
        };

        // Clear existing resources
        await clearExistingResources(projectId);

        // Step 1: Save files to AWS S3
        await sendUpdate('upload', 'pending');
        const s3Status = await saveFilesToS3(projectStructure, projectId);
        await sendUpdate('upload', s3Status);

        // Step 2: Create GitHub repository and push code
        await sendUpdate('deploy', 'pending');
        const { repoUrl, githubStatus } = await createGitHubRepoAndPushCode(projectStructure, projectId);
        await sendUpdate('deploy', githubStatus);

        // Step 3: Deploy to Vercel
        await sendUpdate('build', 'pending');
        const { deploymentUrl, vercelStatus, error } = await deployToVercel(repoUrl, projectId);
        await sendUpdate('build', vercelStatus, { deploymentUrl, error });

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

async function clearExistingResources(projectId: string) {
  // Clear S3
  const listParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${projectId}/`,
  };
  const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));
  if (listedObjects.Contents?.length > 0) {
    await Promise.all(listedObjects.Contents.map(({ Key }) => 
      s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key }))
    ));
  }

  // Delete GitHub repo if exists
  try {
    await octokit.repos.delete({
      owner: process.env.GITHUB_USERNAME,
      repo: `project-${projectId}`,
    });
  } catch (error) {
    // Ignore if repo doesn't exist
  }

  // Delete Vercel project if exists
  try {
    const projectsResponse = await fetch(`https://api.vercel.com/v9/projects`, {
      headers: { 'Authorization': `Bearer ${vercelToken}` },
    });
    const projects = await projectsResponse.json();
    const existingProject = projects.projects.find(p => p.name === `project-${projectId}`);
    if (existingProject) {
      await fetch(`https://api.vercel.com/v9/projects/${existingProject.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${vercelToken}` },
      });
    }
  } catch (error) {
    // Ignore if project doesn't exist
  }
}

async function saveFilesToS3(projectStructure: any, projectId: string, currentPath = '') {
  try {
    for (const [key, value] of Object.entries(projectStructure)) {
      const newPath = currentPath ? `${currentPath}/${key}` : key;
      
      if (typeof value === 'string') {
        // It's a file, upload it using Upload
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${projectId}/${newPath}`,
            Body: value,
          },
        });

        await upload.done();
      } else if (typeof value === 'object' && value !== null) {
        // It's a directory, recurse
        await saveFilesToS3(value, projectId, newPath);
      }
    }
    return 'success';
  } catch (error) {
    console.error('Error saving to S3:', error);
    return 'failed';
  }
}

async function createGitHubRepoAndPushCode(projectStructure: any, projectId: string) {
  try {
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: `project-${projectId}`,
      private: true,
    });

    async function createOrUpdateFile(path: string, content: string) {
      await octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: repo.name,
        path,
        message: `Add ${path}`,
        content: Base64.encode(content),
        branch: 'main',
      });
    }

    async function pushFiles(structure: any, currentPath = '') {
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

async function deployToVercel(repoUrl: string, projectId: string) {
  try {
    // Step 1: Create a new project
     const createProjectResponse = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `project-${projectId}`,
        gitRepository: {
          type: 'github',
          repo: repoUrl.split('github.com/')[1],
        },
        framework: 'nextjs',
        buildCommand: null,
        devCommand: null,
        installCommand: null,
        outputDirectory: null,
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
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `project-${projectId}`,
        deploymentId: projectId,
        project: projectData.id,
        target: 'production',
        gitSource: {
          type: 'github',
          repo: repoUrl.split('github.com/')[1],
          ref: 'main',
          repoId: repoId,
        },
        projectSettings: {
          framework: 'nextjs',
          nodeVersion: '20.x',
        },
      }),
    });

    if (!deployResponse.ok) {
      throw new Error(`Failed to create deployment: ${await deployResponse.text()}`);
    }

    const deployData = await deployResponse.json();

    // Step 4: Poll for deployment status
    let deploymentStatus = deployData.readyState;
    let deploymentUrl = deployData.url;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes maximum waiting time
    
    while (['QUEUED', 'INITIALIZING', 'ANALYZING', 'BUILDING'].includes(deploymentStatus) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

      const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deployData.id}`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
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
      const errorResponse = await fetch(`https://api.vercel.com/v13/deployments/${deployData.id}`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      });
      const errorData = await errorResponse.json();
      console.error('Deployment error details:', JSON.stringify(errorData, null, 2));
      throw new Error(`Deployment failed with status: ${deploymentStatus}. Check console for details.`);
    }
  } catch (error) {
    console.error('Error deploying to Vercel:', error);
    return { deploymentUrl: null, vercelStatus: 'failed', error: error.message };
  }
}




