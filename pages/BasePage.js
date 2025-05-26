require('dotenv').config();
const { URLS, LANGUAGES, TIMEOUTS } = require('../utils/constants');
const { getRandomArrayItem, generateRandomText, generateRandomPhoneNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = URLS.BASE_URL;
        
        // Language settings
        this.languages = Object.values(LANGUAGES);
        this.currentLanguage = null;
        this.languageDropdown = "#navbarDropdown_clang";
    }

    /**
     * Get the page title
     * @returns {Promise<string>} The page title
     */
    async getPageTitle() {
        try {
            return await this.page.title();
        } catch (error) {
            logger.error('Failed to get page title', { error: error.message });
            throw error;
        }
    }

    /**
     * Set the interface language
     * @param {string} language - Language code ('ru', 'en', or 'ro')
     */
    async setLanguage(language) {
        try {
            logger.step(`Setting language to ${language}`);
            
            if (!this.languages.includes(language)) {
                throw new Error(`Unsupported language: ${language}. Supported languages are: ${this.languages.join(', ')}`);
            }

            await this.page.locator(this.languageDropdown).click();
            
            const languageOption = this.page.locator(`text="${language}"`).first();
            await languageOption.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
            await languageOption.click();
            
            this.currentLanguage = language;
            logger.step(`Setting language to ${language}`, 'success');
        } catch (error) {
            logger.step(`Setting language to ${language}`, 'error', { error: error.message });
            throw error;
        }
    }

    /**
     * Get a random item from an array
     * @param {Array} array - Array to select from
     * @returns {*} Random item from array
     * @deprecated Use helpers.getRandomArrayItem instead
     */
    getRandomArrayItem(array) {
        logger.warn('BasePage.getRandomArrayItem is deprecated. Use helpers.getRandomArrayItem instead.');
        return getRandomArrayItem(array);
    }

    /**
     * Generate random text of specified length
     * @param {number} wordCount - Number of words to generate
     * @returns {string} Random text
     * @deprecated Use helpers.generateRandomText instead
     */
    generateRandomText(wordCount = 5) {
        logger.warn('BasePage.generateRandomText is deprecated. Use helpers.generateRandomText instead.');
        return generateRandomText(wordCount);
    }

    /**
     * Generate a random 8-digit phone number
     * @returns {string} Random phone number
     * @deprecated Use helpers.generateRandomPhoneNumber instead
     */
    generateRandomPhoneNumber() {
        logger.warn('BasePage.generateRandomPhoneNumber is deprecated. Use helpers.generateRandomPhoneNumber instead.');
        return generateRandomPhoneNumber();
    }

    /**
     * Wait for element to be visible and stable
     * @param {string|Locator} selector - Element selector or locator
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<Locator>} Element locator
     */
    async waitForElement(selector, timeout = TIMEOUTS.MEDIUM) {
        try {
            const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
            await locator.waitFor({ state: 'visible', timeout });
            return locator;
        } catch (error) {
            logger.error(`Failed to wait for element: ${selector}`, { error: error.message });
            throw error;
        }
    }

    /**
     * Click element with retry logic
     * @param {string|Locator} selector - Element selector or locator
     * @param {Object} options - Click options
     */
    async clickElement(selector, options = {}) {
        try {
            const locator = await this.waitForElement(selector);
            await locator.scrollIntoViewIfNeeded();
            await locator.click(options);
        } catch (error) {
            logger.error(`Failed to click element: ${selector}`, { error: error.message });
            throw error;
        }
    }

    /**
     * Fill input field with text
     * @param {string|Locator} selector - Element selector or locator
     * @param {string} text - Text to fill
     */
    async fillInput(selector, text) {
        try {
            const locator = await this.waitForElement(selector);
            await locator.clear();
            await locator.fill(text);
        } catch (error) {
            logger.error(`Failed to fill input: ${selector}`, { error: error.message, text });
            throw error;
        }
    }

    /**
     * Get current URL
     * @returns {Promise<string>} Current page URL
     */
    async getCurrentUrl() {
        try {
            return this.page.url();
        } catch (error) {
            logger.error('Failed to get current URL', { error: error.message });
            throw error;
        }
    }

    /**
     * Navigate to URL
     * @param {string} url - URL to navigate to
     */
    async navigateTo(url) {
        try {
            logger.step(`Navigating to ${url}`);
            await this.page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUTS.NAVIGATION });
            logger.step(`Navigating to ${url}`, 'success');
        } catch (error) {
            logger.step(`Navigating to ${url}`, 'error', { error: error.message });
            throw error;
        }
    }
}

module.exports = BasePage; 