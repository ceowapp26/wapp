import { Server as SocketServer } from 'socket.io';

const SocketHandler = (req, res) => {
  console.log('SocketHandler called');
  
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    try {
      const io = new SocketServer(res.socket.server, {
        path: '/socket.io',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });
      res.socket.server.io = io;

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });

        // Your other socket event handlers here
      });

      console.log('Socket.IO server initialized successfully');
    } catch (error) {
      console.error('Error initializing Socket.IO server:', error);
    }
  } else {
    console.log('Socket.IO server already running');
  }
  
  res.end();
};

export default SocketHandler;