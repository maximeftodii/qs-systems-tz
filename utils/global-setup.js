require('dotenv').config();

/**
 * Global setup for Playwright tests
 * Validates environment variables and performs any necessary setup
 */
async function globalSetup() {
  console.log('🚀 Starting global setup...');
  
  // Validate required environment variables
  const requiredEnvVars = ['EMAIL', 'PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please create a .env file with the required variables.'
    );
  }
  
  console.log('✅ Environment variables validated');
  console.log('✅ Global setup completed');
}

module.exports = globalSetup; 