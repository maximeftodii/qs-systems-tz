const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');
const { isValidEmail } = require('../utils/helpers');
const logger = require('../utils/logger');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Login-related selectors
        this.selectors = {
            loginButton: "//a[@class='btn btn-elegant btn-rounded my-3 waves-effect waves-light']",
            emailInputField: "//input[@id='UserName']",
            passwordField: "(//input[@id='Password'])[1]",
            loginFormButton: "//div[@id='panel7']//button[contains(@class, 'btn-light-green')]",
            userMenuButton: "#navbarDropdown_cUser",
            loginModal: '#modalLRForm'
        };
    }

    /**
     * Validate login credentials
     * @private
     */
    _validateCredentials() {
        const email = process.env.EMAIL;
        const password = process.env.PASSWORD;

        if (!email || !password) {
            throw new Error('EMAIL and PASSWORD environment variables are required');
        }

        if (!isValidEmail(email)) {
            throw new Error('Invalid email format in EMAIL environment variable');
        }

        return { email, password };
    }

    /**
     * Perform login with credentials from environment variables
     */
    async login() {
        try {
            logger.step('Starting login process');
            
            const { email, password } = this._validateCredentials();
            
            // Click login button
            await this.clickElement(this.selectors.loginButton);
            
            // Wait for login modal to appear
            await this.waitForElement(this.selectors.loginModal);
            
            // Fill credentials
            await this.fillInput(this.selectors.emailInputField, email);
            await this.fillInput(this.selectors.passwordField, password);
            
            // Submit login form and wait for navigation
            await Promise.all([
                this.page.waitForNavigation({ timeout: TIMEOUTS.NAVIGATION }),
                this.clickElement(this.selectors.loginFormButton)
            ]);
            
            logger.step('Login process', 'success');
        } catch (error) {
            logger.step('Login process', 'error', { error: error.message });
            throw error;
        }
    }

    /**
     * Verify that login was successful by checking for user menu
     * @returns {Promise<boolean>} True if user menu is visible and contains correct email
     */
    async isLoggedIn() {
        try {
            logger.step('Verifying login status');
            
            const { email } = this._validateCredentials();
            
            // Wait for user menu to be visible
            const userMenu = await this.waitForElement(this.selectors.userMenuButton, TIMEOUTS.MEDIUM);
            
            // Get user email from menu
            const userEmail = await userMenu.textContent();
            const isLoggedIn = userEmail && userEmail.includes(email);
            
            if (isLoggedIn) {
                logger.step('Login verification', 'success', { userEmail });
            } else {
                logger.step('Login verification', 'error', { 
                    expected: email, 
                    actual: userEmail 
                });
            }
            
            return isLoggedIn;
        } catch (error) {
            logger.step('Login verification', 'error', { error: error.message });
            return false;
        }
    }

    /**
     * Logout from the application
     */
    async logout() {
        try {
            logger.step('Starting logout process');
            
            // Click user menu
            await this.clickElement(this.selectors.userMenuButton);
            
            // Look for logout option (this selector may need to be updated based on actual UI)
            const logoutSelector = "//a[contains(text(), 'Logout') or contains(text(), 'Sign out')]";
            await this.clickElement(logoutSelector);
            
            // Wait for redirect to login page
            await this.page.waitForURL('**/login**', { timeout: TIMEOUTS.NAVIGATION });
            
            logger.step('Logout process', 'success');
        } catch (error) {
            logger.step('Logout process', 'error', { error: error.message });
            throw error;
        }
    }

    /**
     * Check if user is currently on login page
     * @returns {Promise<boolean>} True if on login page
     */
    async isOnLoginPage() {
        try {
            const currentUrl = await this.getCurrentUrl();
            const loginButton = this.page.locator(this.selectors.loginButton);
            const isLoginButtonVisible = await loginButton.isVisible();
            
            return isLoginButtonVisible || currentUrl.includes('login');
        } catch (error) {
            logger.error('Failed to check if on login page', { error: error.message });
            return false;
        }
    }
}

module.exports = LoginPage; 