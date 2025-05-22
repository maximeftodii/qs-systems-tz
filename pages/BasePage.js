require('dotenv').config();

class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://app.qsystemsglobal.com/VST/MDA/WebApp';
        
        // Common language settings
        this.languages = ['ru', 'en', 'ro'];
        this.currentLanguage = null;
        this.languageDropdown = "#navbarDropdown_clang";
    }

    /**
     * Get the page title
     * @returns {Promise<string>} The page title
     */
    async getPageTitle() {
        return this.page.title();
    }

    /**
     * Set the interface language
     * @param {string} language - Language code ('ru', 'en', or 'ro')
     */
    async setLanguage(language) {
        try {
            if (!this.languages.includes(language)) {
                throw new Error(`Unsupported language: ${language}. Supported languages are: ${this.languages.join(', ')}`);
            }

            await this.page.locator(this.languageDropdown).click();
            
            const languageOption = this.page.locator(`text="${language}"`).first();
            await languageOption.click();
            this.currentLanguage = language;
        } catch (error) {
            console.error(`Failed to set language to ${language}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get a random item from an array
     * @param {Array} array - Array to select from
     * @returns {*} Random item from array
     */
    getRandomArrayItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate random text of specified length
     * @param {number} wordCount - Number of words to generate
     * @returns {string} Random text
     */
    generateRandomText(wordCount = 5) {
        const randomWords = [
            'test', 'auto', 'random', 'text', 'word', 'data', 'input',
            'field', 'form', 'value', 'content', 'sample', 'example',
            'entry', 'info', 'note', 'detail', 'item', 'record', 'case'
        ];
        
        const words = [];
        for (let i = 0; i < wordCount; i++) {
            const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
            words.push(randomWord);
        }
        return words.join(' ');
    }

    /**
     * Generate a random 8-digit phone number
     * @returns {string} Random phone number
     */
    generateRandomPhoneNumber() {
        // Generate a random 8-digit number
        let number = '7'; // Start with 7
        for (let i = 0; i < 7; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }
}

module.exports = BasePage; 