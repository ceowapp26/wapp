import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function deleteExistingObjects(bucket, prefix) {
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const listedObjects = await s3Client.send(listCommand);

  if (listedObjects.Contents && listedObjects.Contents.length > 0) {
    await Promise.all(
      listedObjects.Contents.map(async (object) => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucket,
          Key: object.Key,
        });
        await s3Client.send(deleteCommand);
      })
    );
  }
}

export async function POST(req) {
  try {
    const { compiledCode, projectId } = await req.json();
    
    // Process the compiled code
    const processedCode = processCompiledCode(compiledCode);

    // Create a bundle with routing
    const bundle = createBundle(processedCode);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>App Preview</title>
          <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/history@5/umd/history.production.min.js"></script>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            nav { background-color: #f0f0f0; padding: 10px; }
            nav a { margin-right: 10px; text-decoration: none; color: #333; }
            #root { padding: 20px; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>${bundle}</script>
        </body>
      </html>
    `;

    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const prefix = `${projectId}/`;

    // Clean existing objects
    await deleteExistingObjects(bucket, prefix);

    // Upload new file
    const params = {
      Bucket: bucket,
      Key: `${prefix}index.html`,
      Body: htmlContent,
      ContentType: 'text/html',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${prefix}index.html`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: 'Failed to upload compiled code' }, { status: 500 });
  }
}

function processCompiledCode(compiledCode) {
  // Remove import statements and export declarations
  return compiledCode
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/export\s+\{[^}]+\};?/g, '')
    .replace(/export\s+default\s+/g, 'const ');
}

function createBundle(processedCode) {
  return `
    (function() {
      const React = window.React;
      const ReactDOM = window.ReactDOM;
      const history = window.History.createBrowserHistory();

      ${processedCode}

      // Simple routing system
      const Route = ({ path, component: Component }) => {
        const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

        React.useEffect(() => {
          const unlisten = history.listen(({ location }) => {
            setCurrentPath(location.pathname);
          });
          return unlisten;
        }, []);

        return currentPath === path ? React.createElement(Component) : null;
      };

      const Link = ({ to, children }) => {
        const handleClick = (e) => {
          e.preventDefault();
          history.push(to);
        };

        return React.createElement('a', { href: to, onClick: handleClick }, children);
      };

      // Main App component
      const App = () => {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'nav',
            null,
            React.createElement(Link, { to: '/' }, 'Home'),
            React.createElement(Link, { to: '/public' }, 'Public')
          ),
          React.createElement(Route, { path: '/', component: H }),
          React.createElement(Route, { path: '/public', component: B })
        );
      };

      // Render the app
      ReactDOM.render(React.createElement(App), document.getElementById('root'));
    })();
  `;
}