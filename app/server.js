const express = require('express');
const os = require('os');

const app = express();

// Port defaults to 3000 inside the container
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Read instance name from environment variable, fallback to OS hostname
const INSTANCE_NAME = process.env.INSTANCE_NAME || os.hostname();

// Parse JSON if needed
app.use(express.json());

// Request logging middleware for debugging and demonstration
app.use((req, res, next) => {
  const forwardedFor = req.headers['x-forwarded-for'] || '-';
  const realIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
  console.log(`[${INSTANCE_NAME}] ${req.method} ${req.originalUrl} - IP: ${realIp} (Forwarded-For: ${forwardedFor})`);
  next();
});

// GET / - Root route returning friendly text with instance identifier
app.get('/', (req, res) => {
  res.send(`Hello World from ${INSTANCE_NAME}\n`);
});

// GET /health - JSON health status check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    instance: INSTANCE_NAME,
    hostname: os.hostname(),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// GET /info - JSON metadata about instance, host, environment, and process
app.get('/info', (req, res) => {
  res.status(200).json({
    instance: INSTANCE_NAME,
    hostname: os.hostname(),
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: PORT
    },
    headers: {
      host: req.headers['host'],
      'x-real-ip': req.headers['x-real-ip'] || null,
      'x-forwarded-for': req.headers['x-forwarded-for'] || null,
      'x-forwarded-proto': req.headers['x-forwarded-proto'] || null
    }
  });
});

// Start the server and log confirmation
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${INSTANCE_NAME}] Server listening on port ${PORT}`);
});
