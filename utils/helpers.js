/**
 * Helper utilities for common operations
 */

/**
 * Get a random item from an array
 * @param {Array} array - Array to select from
 * @returns {*} Random item from array
 */
function getRandomArrayItem(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('Array must be non-empty');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random text of specified length
 * @param {number} wordCount - Number of words to generate
 * @returns {string} Random text
 */
function generateRandomText(wordCount = 5) {
  const randomWords = [
    'test', 'auto', 'random', 'text', 'word', 'data', 'input',
    'field', 'form', 'value', 'content', 'sample', 'example',
    'entry', 'info', 'note', 'detail', 'item', 'record', 'case'
  ];
  
  if (wordCount <= 0) {
    throw new Error('Word count must be positive');
  }
  
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomArrayItem(randomWords));
  }
  return words.join(' ');
}

/**
 * Generate a random phone number
 * @param {number} length - Length of phone number (default: 8)
 * @param {string} prefix - Prefix for phone number (default: '7')
 * @returns {string} Random phone number
 */
function generateRandomPhoneNumber(length = 8, prefix = '7') {
  if (length <= 0) {
    throw new Error('Phone number length must be positive');
  }
  
  let number = prefix;
  const remainingDigits = length - prefix.length;
  
  for (let i = 0; i < remainingDigits; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function getRandomInt(min, max) {
  if (min > max) {
    throw new Error('Min value cannot be greater than max value');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with the function result
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await wait(delay);
    }
  }
  
  throw lastError;
}

/**
 * Format date to YYYY-MM-DD format
 * @param {Date} date - Date to format (default: today)
 * @returns {string} Formatted date string
 */
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string for use in selectors
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeForSelector(str) {
  return str.replace(/['"\\]/g, '\\$&');
}

module.exports = {
  getRandomArrayItem,
  generateRandomText,
  generateRandomPhoneNumber,
  getRandomInt,
  wait,
  retryWithBackoff,
  formatDate,
  isValidEmail,
  sanitizeForSelector
}; 