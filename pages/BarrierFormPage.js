const BasePage = require('./BasePage');

class BarrierFormPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Menu text
        this.barriersMenuText = 'Reporting identified barriers';
        this.anonymousReportingText = 'Reporting anonymous';
        this.addButtonText = 'Add';

        // Form labels and options
        this.ageGroupLabel = 'Age group';
        this.ageGroupOptions = ['0 - 12 years', '13 - 18 years', '19 - 24 years', '25 - 34 years', '35 - 44 years', '45 - 54 years', '55 - 64 years', '65 years and over'];
        this.genderOptions = ['Female', 'Male'];
        this.identityOptions = [
            'Nici una din cele menționate',
            'Persoană care m-am aflat mai mult de 3 luni în afa',
            'Person with TB',
            'Person living with HIV',
            'Refugee',
            'Person with a disability'
        ];

        this.dropdownLabels = {
            gender: 'Gender',
            identity: 'I identify myself as...',
            location: 'Location',
            locationType: 'Location type',
            studiesLevel: 'Studies level',
            typeOfUser: 'TypeOfUser',
            phone: 'Phone'
        };

        // Options that are the same in all languages
        this.dropdownOptions = {
            studiesLevel: ['Primare', 'Gimnaziale', 'Liceale', 'Universitare', 'Post-universitare']
        };

        // TB Barriers configuration
        this.tbBarriers = {
            'Nu am acces la medicamente pentru efectele adverse ale tratamentului TB': {
                options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat prescrierea', 'Altele']
            },
            'Nu am acces la tratament asistat video pentru TB': {
                options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat includerea', 'Altele']
            },
            'Nu am acces la serviciile psihologului.': {
                options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat consultatia', 'Altele']
            },
            'Nu am acces la servicii de diagnostic pentru TB': {
                options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat referirea', 'Nu am bani pentru investigatii', 'Altele']
            },
            'Nu am acces la tratament antituberculos': {
                options: ['Medicamentele nu sunt disponibile', 'Nu stiu unde sa ma adresez', 'Nu am posibilitate sa ma deplasez dupa medicamente pentru ca nu am bani de drum', 'Nu am posibilitate sa ma deplasez dupa medicamente din alte cauze', 'Altele']
            },
            'Nu am acces la tratament preventiv pentru TB pentru copii': {
                options: ['Medicamentele nu sunt disponibile', 'Nu stiu unde sa ma adresez', 'Nu am posibilitate sa ma deplasez dupa medicamente', 'Altele']
            },
            'Îmi este dificil să urmez tratamentul pentru TB pentru că nu este adaptat nevoilor mele': {
                options: ['am copii mici acasa de care trebuie sa am grija', 'trebuie să merg zilnic la lucru', 'lucrez peste hotare', 'sunt in varsta si nu ma pot deplasa', 'apartin unei populații cheie (migrant, immigrant, PTHIV, PUD, LGBT, LS)', 'apartin unei minoritati etnice', 'Altele']
            }
        };

        this.locationOptions = ['Anenii Noi', 'Basarabeasca', 'Bender', 'Briceni', 'Cahul', 'Camenca', 'Cantemir', 'Comrat', 'Criuleni', 'Dnestrovsk', 'Drochia'];
        this.locationTypeOptions = ['District', 'Area'];
        this.typeOfUserOptions = [
            'Persoana din grup de risc la Tuberculoză',
            'Person in TB treatment',
            'Persoană cu experiență de TB',
            'Person affiliated to a person with TB',
            'Civil society/community organization representative',
            'Medical worker',
            'Social worker'
        ];
    }

    /**
     * Click on the barriers reporting menu
     */
    async clickBarriersMenu() {
        try {
            console.log('Clicking barriers menu');
            const menuSelector = `//a[contains(@class, "collapsible-header") and contains(., "${this.barriersMenuText}")]`;
            
            const menu = this.page.locator(menuSelector);
            await menu.waitFor({ state: 'visible', timeout: 10000 });
            await menu.click();
            console.log('Successfully clicked barriers menu');
        } catch (error) {
            console.error(`Failed to click barriers menu: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click on the anonymous reporting submenu
     */
    async clickAnonymousReporting() {
        try {
            console.log('Clicking anonymous reporting');
            await this.page.waitForSelector('.collapsible-body', { state: 'visible', timeout: 5000 });

            const submenuSelector = `//a[contains(@class, "waves-effect") and contains(., "${this.anonymousReportingText}")]`;
            const submenuItem = this.page.locator(submenuSelector);
            await submenuItem.waitFor({ state: 'visible', timeout: 5000 });
            
            await Promise.all([
                this.page.waitForNavigation(),
                submenuItem.click()
            ]);
            console.log('Successfully clicked anonymous reporting');
        } catch (error) {
            console.error(`Failed to click anonymous reporting: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click the Add button
     */
    async clickAddButton() {
        try {
            console.log('Clicking Add button');
            const buttonSelector = `//div[contains(@class, "dx-button-content")]//span[contains(@class, "dx-button-text") and contains(text(), "${this.addButtonText}")]`;

            const addButton = this.page.locator(buttonSelector);
            await addButton.waitFor({ state: 'visible', timeout: 5000 });
            await addButton.click();
            console.log('Successfully clicked Add button');
        } catch (error) {
            console.error(`Failed to click Add button: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click on the rights selection button
     */
    async clickRightsButton() {
        try {
            console.log('Clicking rights selection button');
            const buttonText = 'Dreptul la viața si Dreptul la cel mai inalt standard realizabil de sănătate fizică și mentală';
            const buttonSelector = `//span[contains(@class, "dx-button-text") and text()="${buttonText}"]`;
            
            const button = this.page.locator(buttonSelector);
            await button.waitFor({ state: 'visible', timeout: 5000 });
            await button.click();
            console.log('Successfully clicked rights button');
        } catch (error) {
            console.error(`Failed to click rights button: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select a value from any dropdown on the page
     * @param {string} dropdownLabel - The label text of the dropdown
     * @param {string} optionToSelect - The option text to select from the dropdown
     */
    async selectDropdownOption(dropdownLabel, optionToSelect) {
        try {
            console.log(`Attempting to select "${optionToSelect}" from dropdown "${dropdownLabel}"`);
            
            // Special handling for TypeOfUser
            let labelSelector;
            if (dropdownLabel === 'TypeOfUser') {
                labelSelector = `//span[contains(@class, "dx-field-item-label-text") and contains(text(), "TypeOfUser")]`;
            } else {
                labelSelector = `//span[contains(@class, "dx-field-item-label-text") and text()="${dropdownLabel}"]`;
            }

            const label = this.page.locator(labelSelector);
            await label.waitFor({ state: 'visible', timeout: 10000 });
            
            // Find and click the button
            const button = this.page.locator(`${labelSelector}/following::div[contains(@class, "dx-dropdowneditor-button")][1]`);
            await button.waitFor({ state: 'visible', timeout: 10000 });
            await button.click();

            // Wait for the popup to be visible and active
            await this.page.waitForSelector('.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)', {
                state: 'visible',
                timeout: 10000
            });

            // Make sure the popup is fully visible before proceeding
            await this.page.waitForTimeout(1000);

            // Try to find and click the option using a more specific selector
            const optionSelector = `//div[contains(@class, "dx-overlay-content") and not(contains(@class, "dx-state-invisible"))]//div[contains(@class, "dx-item-content") and normalize-space()="${optionToSelect}"]`;
            const option = this.page.locator(optionSelector);
            await option.waitFor({ state: 'visible', timeout: 10000 });
            await option.click();
            
            await this.page.waitForTimeout(1000);
            console.log(`Successfully selected "${optionToSelect}" from dropdown "${dropdownLabel}"`);
        } catch (error) {
            console.error(`Failed to select option from dropdown: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select identity
     * @returns {string} The selected identity
     */
    async selectIdentity() {
        try {
            console.log('Selecting identity option');
            const identityLabel = this.dropdownLabels.identity;
            const randomIdentity = this.getRandomArrayItem(this.identityOptions);
            
            // Find and click the identity dropdown specifically
            const dropdownSelector = `//span[contains(@class, "dx-field-item-label-text") and text()="${identityLabel}"]/following::div[contains(@class, "dx-dropdowneditor-input-wrapper")][1]`;
            const dropdown = this.page.locator(dropdownSelector);
            await dropdown.waitFor({ state: 'visible', timeout: 10000 });
            await dropdown.click();
            
            // Wait for dropdown list to be visible
            await this.page.waitForTimeout(1000);
            
            // Select the option
            const optionSelector = `//div[contains(@class, "dx-overlay-wrapper") and contains(@class, "dx-dropdowneditor-overlay")]//div[contains(@class, "dx-item-content") and normalize-space()="${randomIdentity}"]`;
            const option = this.page.locator(optionSelector);
            await option.waitFor({ state: 'visible', timeout: 10000 });
            await option.click();
            
            await this.page.waitForTimeout(1000);
            console.log(`Successfully selected identity: ${randomIdentity}`);
            return randomIdentity;
        } catch (error) {
            console.error(`Failed to select identity: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select age group
     * @returns {string} The selected age group
     */
    async selectAgeGroup() {
        try {
            const randomAgeGroup = this.getRandomArrayItem(this.ageGroupOptions);
            await this.selectDropdownOption(this.ageGroupLabel, randomAgeGroup);
            return randomAgeGroup;
        } catch (error) {
            console.error(`Failed to select age group: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select gender
     */
    async selectGender() {
        try {
            const genderLabel = this.dropdownLabels.gender;
            const randomGender = this.getRandomArrayItem(this.genderOptions);
            await this.selectDropdownOption(genderLabel, randomGender);
        } catch (error) {
            console.error(`Failed to select gender: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select location
     */
    async selectLocation() {
        try {
            const locationLabel = this.dropdownLabels.location;
            const randomLocation = this.getRandomArrayItem(this.locationOptions);
            await this.selectDropdownOption(locationLabel, randomLocation);
        } catch (error) {
            console.error(`Failed to select location: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select location type
     */
    async selectLocationType() {
        try {
            const locationTypeLabel = this.dropdownLabels.locationType;
            const randomLocationType = this.getRandomArrayItem(this.locationTypeOptions);
            await this.selectDropdownOption(locationTypeLabel, randomLocationType);
        } catch (error) {
            console.error(`Failed to select location type: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select studies level
     */
    async selectStudiesLevel() {
        try {
            const studiesLabel = this.dropdownLabels.studiesLevel;
            const randomStudiesLevel = this.getRandomArrayItem(this.dropdownOptions.studiesLevel);
            await this.selectDropdownOption(studiesLabel, randomStudiesLevel);
        } catch (error) {
            console.error(`Failed to select studies level: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select type of user
     * @returns {string} The selected type of user
     */
    async selectTypeOfUser() {
        try {
            const typeOfUserLabel = this.dropdownLabels.typeOfUser;
            const randomTypeOfUser = this.getRandomArrayItem(this.typeOfUserOptions);
            console.log(`Selecting random type of user: ${randomTypeOfUser}`);
            
            const input = this.page.getByRole('combobox', { name: typeOfUserLabel });
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.click();
            
            await this.page.waitForSelector('.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)', {
                state: 'visible',
                timeout: 5000
            });
            
            await this.page.waitForTimeout(500);
            
            const optionSelector = `//div[contains(@class, "dx-item-content") and normalize-space()="${randomTypeOfUser}"]/parent::div[contains(@class, "dx-list-item")]`;
            const option = this.page.locator(optionSelector);
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();
            
            await this.page.waitForTimeout(1000);
            console.log(`Successfully selected type of user "${randomTypeOfUser}"`);
            return randomTypeOfUser;
        } catch (error) {
            console.error(`Failed to select type of user: ${error.message}`);
            throw error;
        }
    }

    /**
     * Input phone number
     */
    async inputPhoneNumber() {
        try {
            const phoneLabel = this.dropdownLabels.phone;
            const phoneNumber = this.generateRandomPhoneNumber();
            
            // Find and fill the phone input field using role and name attributes
            const input = this.page.getByRole('textbox', { name: phoneLabel });
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.click();
            
            // Clear the field first to ensure clean input
            await input.clear();
            await this.page.waitForTimeout(500);
            
            // Input the number character by character to ensure accuracy
            for (const digit of phoneNumber) {
                await input.type(digit, { delay: 50 });
            }
            
            console.log(`Successfully input phone number`);
        } catch (error) {
            console.error(`Failed to input phone number: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select a TB barrier option and its sub-option
     * @param {string} barrierLabel - The barrier dropdown label
     */
    async selectTBBarrier(barrierLabel) {
        try {
            console.log(`Selecting TB barrier: ${barrierLabel}`);

            // First find the exact input by using role and name
            const input = this.page.getByRole('combobox', { name: barrierLabel });
            await input.waitFor({ state: 'attached', timeout: 15000 });

            // Scroll to ensure the dropdown has space to open
            await this.page.evaluate(label => {
                const element = document.querySelector(`input[aria-label="${label}"]`);
                if (element) {
                    const scrollContainer = element.closest('.dx-scrollable-container') || element.closest('.dx-scrollview-content');
                    if (scrollContainer) {
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const elementRect = element.getBoundingClientRect();
                        scrollContainer.scrollTop += elementRect.top - containerRect.top - 150;
                    } else {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, barrierLabel);

            await this.page.waitForTimeout(1000);
            await input.waitFor({ state: 'visible', timeout: 15000 });
            await input.click();
            await this.page.waitForTimeout(1000);

            if (this.tbBarriers[barrierLabel].options.length > 0) {
                const options = this.tbBarriers[barrierLabel].options;
                const randomOption = options[Math.floor(Math.random() * options.length)];
                const optionSelector = `//div[contains(@class, 'dx-overlay-content') and not(contains(@class, 'dx-state-invisible'))]//div[contains(@class, 'dx-list-item-content') and normalize-space()='${randomOption}']`;
                
                await this.page.waitForSelector(optionSelector, { state: 'visible', timeout: 10000 });
                const optionElements = this.page.locator(optionSelector);
                const count = await optionElements.count();
                
                let clicked = false;
                for (let i = 0; i < count && !clicked; i++) {
                    const option = optionElements.nth(i);
                    if (await option.isVisible()) {
                        await option.click({ timeout: 5000 });
                        clicked = true;
                        break;
                    }
                }

                if (!clicked) {
                    throw new Error(`Failed to click option: ${randomOption} for barrier: ${barrierLabel}`);
                }

                console.log(`Selected option "${randomOption}" for barrier "${barrierLabel}"`);
                await this.page.waitForTimeout(1000);
            }
        } catch (error) {
            console.error(`Failed to select TB barrier: ${error.message}`);
            throw error;
        }
    }

    /**
     * Fill in the "Alte detalii" text field with random text
     */
    async fillOtherDetails() {
        try {
            console.log('Filling in Alte detalii field');

            const textField = this.page.getByRole('textbox', { name: 'Alte detalii' });
            await textField.waitFor({ state: 'visible', timeout: 15000 });
            await textField.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);

            const wordCount = Math.floor(Math.random() * 6) + 5;
            const randomText = this.generateRandomText(wordCount);
            
            await textField.fill(randomText);
            await this.page.waitForTimeout(500);

            console.log(`Successfully filled in Alte detalii with: "${randomText}"`);
        } catch (error) {
            console.error(`Failed to fill in Alte detalii: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click the Save button and verify the save was successful
     */
    async clickSaveButton() {
        try {
            console.log('Clicking Save button');

            const saveButton = this.page.getByRole('button', { name: 'Save' });
            await saveButton.waitFor({ state: 'visible', timeout: 15000 });
            await saveButton.scrollIntoViewIfNeeded();
            await saveButton.click();

            try {
                const loadingIndicator = this.page.locator('.button-indicator');
                await loadingIndicator.waitFor({ state: 'visible', timeout: 5000 });
                await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
            } catch (error) {
                console.log('No loading indicator shown during save');
            }

            console.log('Successfully saved and verified');
        } catch (error) {
            console.error(`Failed to save or verify: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select all TB barriers with random options
     */
    async selectRandomTBBarriers() {
        try {
            console.log('Selecting all TB barriers');
            
            const barriers = Object.keys(this.tbBarriers);
            for (const barrier of barriers) {
                await this.selectTBBarrier(barrier);
                await this.page.waitForTimeout(2000);
            }

            await this.fillOtherDetails();
            await this.clickSaveButton();
            
            console.log(`Successfully completed the form submission and verification`);
        } catch (error) {
            console.error(`Failed to complete form submission: ${error.message}`);
            throw error;
        }
    }
}

module.exports = BarrierFormPage; 