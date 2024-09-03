const { parentPort } = require('worker_threads');
const esbuild = require('esbuild');
const { fs: memfs, vol } = require('memfs');
const path = require('path');
const crypto = require('crypto');

async function createProjectInMemory(projectStructure) {
  vol.reset();
  
  function createFiles(structure, currentPath = '/') {
    for (const [key, value] of Object.entries(structure)) {
      const fullPath = path.join(currentPath, key);
      if (typeof value === 'string') {
        memfs.mkdirSync(path.dirname(fullPath), { recursive: true });
        memfs.writeFileSync(fullPath, value);
      } else if (typeof value === 'object') {
        memfs.mkdirSync(fullPath, { recursive: true });
        createFiles(value, fullPath);
      }
    }
  }
  createFiles(projectStructure);

  // Ensure index files exist for component directories
  const componentDirs = [
    '/src/app/(route)/_components/PublicNoteList',
    '/src/app/(route)/_components/PublicResourceList',
    '/src/app/home/_components/NoteList',
    '/src/app/home/_components/AssignmentList',
    '/src/app/home/_components/ResourceForm',
  ];

  componentDirs.forEach(dir => {
    const indexPath = path.join(dir, 'index.tsx');
    if (!memfs.existsSync(indexPath)) {
      memfs.writeFileSync(indexPath, `export { default } from './${path.basename(dir)}';`);
    }
  });

  // Add mock react and react-dom modules
  memfs.mkdirSync('/node_modules/react', { recursive: true });
  memfs.writeFileSync('/node_modules/react/index.js', 'module.exports = { createElement: () => {}, useState: () => {} };');
  memfs.mkdirSync('/node_modules/react-dom', { recursive: true });
  memfs.writeFileSync('/node_modules/react-dom/index.js', 'module.exports = { render: () => {} };');
}

async function compileWithEsbuild(projectStructure) {
  const entryPoints = findEntryPoints(projectStructure);
  const result = await esbuild.build({
    entryPoints,
    bundle: true,
    write: false,
    format: 'esm',
    target: 'es2015',
    jsx: 'transform',
    loader: { '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.jsx': 'jsx' },
    minify: true,
    sourcemap: false,
    outdir: 'out',
    external: ['react', 'react-dom'],
    plugins: [
      {
        name: 'memfs',
        setup(build) {
          build.onResolve({ filter: /.*/ }, args => {
            if (args.path === 'react' || args.path === 'react-dom') {
              return { path: args.path, external: true };
            }
            if (args.importer === '') {
              return { path: '/' + args.path, namespace: 'memfs' };
            }
            let resolvedPath = path.resolve(path.dirname(args.importer), args.path);
            if (!path.extname(resolvedPath)) {
              // If no extension, try to resolve as a directory or with extensions
              const possiblePaths = [
                resolvedPath + '.js',
                resolvedPath + '.jsx',
                resolvedPath + '.ts',
                resolvedPath + '.tsx',
                path.join(resolvedPath, 'index.js'),
                path.join(resolvedPath, 'index.jsx'),
                path.join(resolvedPath, 'index.ts'),
                path.join(resolvedPath, 'index.tsx'),
              ];
              for (const possiblePath of possiblePaths) {
                if (memfs.existsSync(possiblePath)) {
                  resolvedPath = possiblePath;
                  break;
                }
              }
            }
            return { path: resolvedPath, namespace: 'memfs' };
          });
          build.onLoad({ filter: /.*/, namespace: 'memfs' }, args => {
            if (memfs.existsSync(args.path)) {
              const contents = memfs.readFileSync(args.path, 'utf8');
              return { contents, loader: path.extname(args.path).slice(1) || 'js' };
            }
            return null;
          });
        },
      },
    ],
  });

  const compiledCode = result.outputFiles
    .filter(file => file.path.endsWith('.js'))
    .map(file => file.text)
    .join('\n\n');

  return compiledCode;
}

function findEntryPoints(structure, currentPath = '') {
  let entryPoints = [];
  for (const [key, value] of Object.entries(structure)) {
    const newPath = currentPath ? `${currentPath}/${key}` : key;
    if (typeof value === 'string' && /\.(js|jsx|ts|tsx)$/.test(key)) {
      entryPoints.push('/' + newPath);
    } else if (typeof value === 'object') {
      entryPoints = entryPoints.concat(findEntryPoints(value, newPath));
    }
  }
  return entryPoints;
}

parentPort.on('message', async ({ projectStructure }) => {
  try {
    await createProjectInMemory(projectStructure);
    const compiledCode = await compileWithEsbuild(projectStructure);
    const projectId = crypto.randomBytes(16).toString('hex');
    parentPort.postMessage({ success: true, result: { projectId, compiledCode } });
  } catch (error) {
    console.error('Error in worker:', error);
    parentPort.postMessage({ success: false, error: error.message });
  }
});

