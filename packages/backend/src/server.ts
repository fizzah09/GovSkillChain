import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = parseInt(process.env.PORT || '8080', 10);

// Fly.io requires binding to 0.0.0.0, not 127.0.0.1
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║        GovSkill Chain — Backend API                     ║
║        http://${HOST}:${PORT}                            ║
║        Health: http://${HOST}:${PORT}/health             ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

export default server;
