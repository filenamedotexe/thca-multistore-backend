#!/usr/bin/env node

const { configLoader, expressLoader } = require('@medusajs/framework');
const path = require('path');

async function startServer() {
  try {
    console.log('Starting Medusa v2 server...');
    
    // Load config first (pass directory, not file path)
    const config = await configLoader(__dirname);
    
    console.log('Config loaded successfully');
    
    // Load the express app
    const app = await expressLoader(config);
    
    const port = process.env.PORT || 9000;
    
    app.listen(port, () => {
      console.log(`🚀 Medusa backend started successfully!`);
      console.log(`🔗 API URL: http://localhost:${port}`);
      console.log(`👤 Admin URL: http://localhost:${port}/app`);
      console.log('✅ Backend is ready to serve all 3 cannabis stores');
    });
    
  } catch (error) {
    console.error('❌ Failed to start Medusa server:', error);
    console.error('Error details:', error.stack);
    process.exit(1);
  }
}

startServer();