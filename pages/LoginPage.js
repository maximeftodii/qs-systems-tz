const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Login-related selectors
        this.loginButton = "//a[@class='btn btn-elegant btn-rounded my-3 waves-effect waves-light']";
        this.emailInputField = "//input[@id='UserName']";
        this.passwordField = "(//input[@id='Password'])[1]";
        this.loginFormButton = "//div[@id='panel7']//button[contains(@class, 'btn-light-green')]";
        this.userMenuButton = "#navbarDropdown_cUser";
    }

    /**
     * Perform login with credentials from environment variables
     */
    async login() {
        try {
            console.log('Starting login process...');
            await this.page.locator(this.loginButton).click();
            await this.page.waitForSelector('#modalLRForm', { state: 'visible' });
            await this.page.locator(this.emailInputField).fill(process.env.EMAIL);
            await this.page.locator(this.passwordField).fill(process.env.PASSWORD);
            await Promise.all([
                this.page.waitForNavigation(),
                this.page.locator(this.loginFormButton).click()
            ]);
            console.log('Login successful');
        } catch (error) {
            console.error(`Login failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify that login was successful by checking for user menu
     * @returns {Promise<boolean>} True if user menu is visible
     */
    async isLoggedIn() {
        try {
            const userMenu = this.page.locator(this.userMenuButton);
            await userMenu.waitFor({ state: 'visible', timeout: 10000 });
            const userEmail = await userMenu.textContent();
            const isLoggedIn = userEmail.includes(process.env.EMAIL);
            console.log(`Login verification: ${isLoggedIn ? 'Successful' : 'Failed'}`);
            return isLoggedIn;
        } catch (error) {
            console.error(`Failed to verify login status: ${error.message}`);
            return false;
        }
    }
}

module.exports = LoginPage; 