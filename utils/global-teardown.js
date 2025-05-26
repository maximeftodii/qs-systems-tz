/**
 * Global teardown for Playwright tests
 * Performs cleanup tasks after all tests complete
 */
async function globalTeardown() {
  console.log('🧹 Starting global teardown...');
  
  // Add any cleanup logic here if needed
  // For example: cleanup test data, close connections, etc.
  
  console.log('✅ Global teardown completed');
}

module.exports = globalTeardown; 