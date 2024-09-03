import { Server as SocketServer } from 'socket.io';
import { SpeechClient } from '@google-cloud/speech';
import { NextApiRequest, NextApiResponse } from 'next';

let io: SocketServer;

const speechToTextHandler = (io: SocketServer) => {
  io.on('connection', (socket) => {
    console.log('Client connected');
    let recognizeStream: any = null;

    socket.on('audioData', (data) => {
      if (!recognizeStream) {
        const speechClient = new SpeechClient({
          credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
        });
        recognizeStream = speechClient
          .streamingRecognize({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: 'en-US',
            },
            interimResults: true,
          })
          .on('error', console.error)
          .on('data', (data) => {
            if (data.results[0] && data.results[0].alternatives[0]) {
              const transcription = data.results[0].alternatives[0].transcript;
              socket.emit('transcription', { transcription });
            }
          });
      }
      recognizeStream.write(data);
    });

    socket.on('endAudio', () => {
      if (recognizeStream) {
        recognizeStream.end();
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (recognizeStream) {
        recognizeStream.end();
      }
    });
  });
};

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    const io = new SocketServer(res.socket.server, {
      path: '/api/speech_to_text',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('audioData', (data) => {
        // Handle audio data
      });

      socket.on('endAudio', () => {
        // Handle end of audio
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already running');
  }

  res.end();
};

export default SocketHandler;


