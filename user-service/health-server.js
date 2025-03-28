/**
 * A simplified version of the user service that only provides the health endpoint
 * This is used as a fallback when the main user service fails to start
 */

const express = require('express');
const cors = require('cors');

// Create a minimal express app
const app = express();
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service-minimal' });
});

// Default route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'User Service Minimal Health Server',
    endpoints: ['/health'],
    note: 'This is a fallback service since the main user service had issues starting'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Minimal User Service running on port ${PORT}`);
}); 