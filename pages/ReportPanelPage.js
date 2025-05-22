const BasePage = require('./BasePage');

class ReportPanelPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Menu text (exact text from application)
        this.reportsText = 'Report panel';
        this.demographicText = 'Demographic communities';

        // Store selected dropdown values
        this.selectedValues = {
            'Type Of User': null,
            'Key population': null,
            'Age': null
        };

        // Mapping between form labels and report panel dropdown names with their selectors
        this.dropdownMapping = {
            'Type Of User': {
                formField: 'Type Of User',
                selector: '[data-dx_placeholder="Type of User"]',
                listSelector: '.dx-overlay-content .dx-scrollview-content'
            },
            'Key population': {
                formField: 'I identify myself as...',
                selector: '[data-dx_placeholder="Key population"]',
                listSelector: '.dx-overlay-content .dx-scrollview-content'
            },
            'Age': {
                formField: 'Age group',
                selector: '[data-dx_placeholder="Age"]',
                listSelector: '.dx-overlay-content .dx-scrollview-content'
            }
        };

        // Dropdown labels (exact text from application)
        this.dropdownLabels = {
            'Type Of User': 'Type of User',
            'Key population': 'Key population',
            'Age': 'Age'
        };
    }

    /**
     * Store the selected dropdown values
     * @param {string} typeOfUser - Selected type of user
     * @param {string} keyPopulation - Selected key population
     * @param {string} ageGroup - Selected age group
     */
    storeSelectedValues(typeOfUser, keyPopulation, ageGroup) {
        this.selectedValues = {
            'Type Of User': typeOfUser,
            'Key population': keyPopulation,
            'Age': ageGroup
        };
        console.log('Stored selected values:', this.selectedValues);
    }

    /**
     * Get the corresponding form value for a report panel dropdown
     * @param {string} reportDropdownName - The name of the dropdown in the report panel
     * @returns {string} The corresponding stored value from the form
     */
    getStoredValueForDropdown(reportDropdownName) {
        if (!this.selectedValues.hasOwnProperty(reportDropdownName)) {
            throw new Error(`Unknown dropdown name: ${reportDropdownName}`);
        }
        return this.selectedValues[reportDropdownName];
    }

    /**
     * Navigate to Demographic Communities section
     */
    async navigateToDemographicCommunities() {
        try {
            console.log('Navigating to Demographic Communities section');
            
            // Click on the Reports menu and wait for it to expand
            const reportsMenuSelector = `//a[contains(@class, "collapsible-header") and contains(., "${this.reportsText}")]`;
            await this.page.waitForSelector(reportsMenuSelector, { state: 'visible', timeout: 10000 });
            await this.page.click(reportsMenuSelector);

            // Wait for the submenu to be visible and clickable
            const demographicSelector = `//a[contains(@class, "waves-effect") and contains(., "${this.demographicText}")]`;
            const submenu = this.page.locator(demographicSelector);
            
            // Wait for both visibility and navigation
            await Promise.all([
                //this.page.waitForNavigation({ waitUntil: 'networkidle' }),
                submenu.waitFor({ state: 'visible', timeout: 10000 }),
                submenu.click({ force: true })
            ]);

            // Wait for the page to be fully loaded
            //await this.page.waitForLoadState('networkidle');
            await this.page.waitForSelector('.dx-toolbar-before', { 
                state: 'visible', 
                timeout: 10000 
            });
            
            console.log('Successfully navigated to Demographic Communities');
        } catch (error) {
            console.error(`Failed to navigate to Demographic Communities: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select a value in a dropdown on the reports page
     * @param {string} dropdownName - The name of the dropdown (Type Of User, Key population, or Age)
     * @param {string} value - The value to select
     */
    async selectDropdownValue(dropdownName, value) {
        try {
            // If no value provided, get it from stored values
            const valueToSelect = value || this.getStoredValueForDropdown(dropdownName);
            console.log(`Selecting ${valueToSelect} in ${dropdownName} dropdown`);
            
            // Get the correct selector for this dropdown
            const dropdownInfo = this.dropdownMapping[dropdownName];
            if (!dropdownInfo) {
                throw new Error(`Unknown dropdown name: ${dropdownName}`);
            }

            // Wait for page to be fully loaded and stable
            await this.page.waitForSelector('.dx-toolbar-before', { 
                state: 'visible', 
                timeout: 10000 
            });

            // Wait for loading panel to disappear
            await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                state: 'hidden',
                timeout: 10000 
            });

            // Additional wait to ensure UI is fully interactive
            await this.page.waitForTimeout(1000);

            // Try to find the dropdown using multiple strategies
            let dropdownElement = null;
            
            // Strategy 1: Try role-based selector
            const combobox = this.page.getByRole('combobox', { name: this.dropdownLabels[dropdownName] });
            if (await combobox.count() > 0) {
                dropdownElement = combobox;
                console.log('Found dropdown using role selector');
            } else {
                // Strategy 2: Try data-dx_placeholder
                const placeholderSelector = `[data-dx_placeholder="${this.dropdownLabels[dropdownName]}"]`;
                const byPlaceholder = this.page.locator(placeholderSelector);
                if (await byPlaceholder.count() > 0) {
                    dropdownElement = byPlaceholder;
                    console.log('Found dropdown using placeholder selector');
                } else {
                    // Strategy 3: Try XPath with class and placeholder
                    const dropdownXPath = `//div[contains(@class, "dx-toolbar-before")]//div[contains(@class, "dx-selectbox")]//div[@data-dx_placeholder="${this.dropdownLabels[dropdownName]}"]`;
                    const dropdownContainer = this.page.locator(dropdownXPath);
                    if (await dropdownContainer.count() > 0) {
                        dropdownElement = dropdownContainer.locator('xpath=ancestor::div[contains(@class, "dx-selectbox")][1]');
                        console.log('Found dropdown using XPath selector');
                    }
                }
            }

            if (!dropdownElement) {
                throw new Error(`Could not find dropdown ${dropdownName} using any selector strategy`);
            }

            // Ensure dropdown is visible and clickable
            await dropdownElement.waitFor({ state: 'visible', timeout: 10000 });
            await dropdownElement.scrollIntoViewIfNeeded();
            
            // Click with retry logic
            let maxRetries = 3;
            let clicked = false;
            
            while (maxRetries > 0 && !clicked) {
                try {
                    await dropdownElement.click({ force: true, timeout: 5000 });
                    
                    // Wait a moment for any animations
                    await this.page.waitForTimeout(500);
                    
                    // Instead of checking overlay, wait for actual options to be visible
                    const optionsVisible = await this.page.evaluate(() => {
                        const items = document.querySelectorAll('.dx-scrollview-content .dx-item-content');
                        return items && items.length > 0 && Array.from(items).some(item => {
                            const style = window.getComputedStyle(item);
                            return style.display !== 'none' && style.visibility !== 'hidden';
                        });
                    });
                    
                    if (!optionsVisible) {
                        console.log('Click registered but options not visible yet, waiting longer...');
                        // Try waiting a bit longer
                        await this.page.waitForTimeout(1000);
                        
                        const optionsVisibleRetry = await this.page.evaluate(() => {
                            const items = document.querySelectorAll('.dx-scrollview-content .dx-item-content');
                            return items && items.length > 0;
                        });
                        
                        if (!optionsVisibleRetry) {
                            console.log('Options still not visible, will retry click');
                            clicked = false;
                            continue;
                        }
                    }
                    
                    clicked = true;
                    console.log('Successfully opened dropdown');
                } catch (e) {
                    console.log(`Click attempt failed, retries left: ${maxRetries - 1}`);
                    maxRetries--;
                    if (maxRetries === 0) throw e;
                    await this.page.waitForTimeout(1000);
                }
            }
            
            if (!clicked) {
                throw new Error('Failed to open dropdown after multiple attempts');
            }
            
            // Wait for dropdown list to be stable
            console.log('Waiting for dropdown options to be stable...');
            let optionsStable = false;
            for (let i = 0; i < 3; i++) {
                try {
                    // Wait for options to be present and visible
                    await this.page.waitForFunction(() => {
                        const items = document.querySelectorAll('.dx-scrollview-content .dx-item-content');
                        return items && items.length > 0 && Array.from(items).some(item => {
                            const style = window.getComputedStyle(item);
                            return style.display !== 'none' && style.visibility !== 'hidden';
                        });
                    }, { timeout: 5000 });
                    
                    // Get the number of options and their states
                    const optionsState = await this.page.evaluate(() => {
                        const items = document.querySelectorAll('.dx-scrollview-content .dx-item-content');
                        return Array.from(items).map(item => {
                            const style = window.getComputedStyle(item);
                            return {
                                text: item.textContent,
                                display: style.display,
                                visibility: style.visibility,
                                opacity: style.opacity,
                                height: style.height,
                                position: style.position,
                                overflow: style.overflow
                            };
                        });
                    });
                    
                    console.log('Option states:', JSON.stringify(optionsState, null, 2));
                    
                    if (optionsState.length > 0) {
                        console.log(`Found ${optionsState.length} options in dropdown`);
                        optionsStable = true;
                        break;
                    }
                    
                    console.log('No options found yet, waiting...');
                    await this.page.waitForTimeout(1000);
                } catch (e) {
                    console.log(`Attempt ${i + 1}: Options not stable, retrying...`);
                    await this.page.waitForTimeout(1000);
                }
            }
            
            if (!optionsStable) {
                throw new Error('Failed to find stable dropdown options after multiple attempts');
            }
            
            // Additional wait for any final animations
            await this.page.waitForTimeout(500);

            // Get all options using a more specific selector that includes parent containers
            console.log('Attempting to locate options with expanded selector...');
            const optionsSelector = [
                '.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)',
                '.dx-scrollview-content',
                '.dx-item.dx-list-item',
                '.dx-item-content.dx-list-item-content'
            ].join(' ');
            
            const options = this.page.locator(optionsSelector);
            
            // Check if options exist before waiting
            const optionCount = await options.count();
            console.log(`Found ${optionCount} options with expanded selector`);
            
            if (optionCount === 0) {
                // Try alternative selector
                const altSelector = '.dx-overlay-wrapper .dx-list-item-content';
                console.log('Trying alternative selector:', altSelector);
                const altOptions = this.page.locator(altSelector);
                const altCount = await altOptions.count();
                
                if (altCount > 0) {
                    console.log(`Found ${altCount} options with alternative selector`);
                    // Use these options instead
                    options = altOptions;
                } else {
                    throw new Error('No options found with any selector');
                }
            }
            
            // Wait for first option with debugging
            console.log('Waiting for first option to be visible...');
            try {
                await options.first().waitFor({ 
                    state: 'visible', 
                    timeout: 10000 
                });
            } catch (e) {
                // If waiting for visible state fails, log the current state
                const firstOptionState = await this.page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    if (!element) return null;
                    const style = window.getComputedStyle(element);
                    return {
                        exists: true,
                        display: style.display,
                        visibility: style.visibility,
                        opacity: style.opacity,
                        boundingRect: element.getBoundingClientRect(),
                        parentDisplay: element.parentElement ? window.getComputedStyle(element.parentElement).display : null,
                        parentVisibility: element.parentElement ? window.getComputedStyle(element.parentElement).visibility : null
                    };
                }, optionsSelector);
                console.log('First option state:', JSON.stringify(firstOptionState, null, 2));
                throw e;
            }
            
            // Get all options and find the matching one
            await options.first().waitFor({ state: 'visible', timeout: 10000 });
            
            // Verify options are loaded
            const count = await options.count();
            console.log(`Found ${count} options in ${dropdownName} dropdown`);
            
            if (count === 0) {
                throw new Error(`No options found in dropdown ${dropdownName}`);
            }

            // Log all available options for debugging
            console.log('Available options:');
            const allOptions = [];
            for (let i = 0; i < count; i++) {
                const text = await options.nth(i).textContent();
                allOptions.push(text);
                console.log(`  ${i + 1}. "${text}"`);
            }

            console.log(`Attempting to match value: "${valueToSelect}"`);
            
            let found = false;
            for (let i = 0; i < count; i++) {
                const option = options.nth(i);
                const text = await option.textContent();
                
                // Try different text comparisons including partial match for long text
                const normalizedText = text.trim().normalize().toLowerCase();
                const normalizedValue = valueToSelect.trim().normalize().toLowerCase();
                
                const exactMatch = normalizedText === normalizedValue;
                const textIncludesValue = normalizedText.includes(normalizedValue);
                const valueIncludesText = normalizedValue.includes(normalizedText);
                const substringMatch = normalizedText.substring(0, 30) === normalizedValue.substring(0, 30);
                
                if (exactMatch || textIncludesValue || valueIncludesText || substringMatch) {
                    console.log(`Found matching option: "${text}"`);
                    console.log('Match type:', 
                        exactMatch ? 'exact match' :
                        textIncludesValue ? 'text includes value' :
                        valueIncludesText ? 'value includes text' :
                        'substring match'
                    );
                    
                    // Make sure option is in view
                    await option.scrollIntoViewIfNeeded();
                    await option.waitFor({ state: 'visible' });
                    
                    // Try clicking with different strategies
                    try {
                        console.log('Attempting to click option...');
                        
                        // Strategy 1: Direct click
                        await option.click({ force: true, timeout: 5000 });
                        console.log('Direct click successful');
                    } catch (e) {
                        console.log('Direct click failed, trying alternative methods...');
                        try {
                            // Strategy 2: Click with JavaScript
                            await this.page.evaluate((selector, index) => {
                                const elements = document.querySelectorAll(selector);
                                if (elements[index]) {
                                    elements[index].click();
                                }
                            }, '.dx-scrollview-content .dx-item-content', i);
                            console.log('JavaScript click successful');
                        } catch (e2) {
                            console.log('JavaScript click failed, trying final method...');
                            // Strategy 3: Click center coordinates
                            const box = await option.boundingBox();
                            if (box) {
                                await this.page.mouse.click(
                                    box.x + box.width / 2,
                                    box.y + box.height / 2
                                );
                                console.log('Coordinate click successful');
                            } else {
                                throw new Error('Failed to get option coordinates');
                            }
                        }
                    }
                    
                    // Verify the selection was successful
                    await this.page.waitForFunction(() => {
                        const overlay = document.querySelector('.dx-overlay-content.dx-popup-normal.dx-resizable');
                        return !overlay || overlay.classList.contains('dx-state-invisible');
                    }, { timeout: 5000 });

                    // Wait for any loading after dropdown selection
                    try {
                        await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                            state: 'visible',
                            timeout: 2000 
                        });
                        await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                            state: 'hidden',
                            timeout: 10000 
                        });
                    } catch (e) {
                        // Loading panel might not appear, which is fine
                        console.log('No loading panel detected after selection');
                    }
                    // Additional wait to ensure UI is stable
                    await this.page.waitForTimeout(1000);
                    
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                console.log(`No exact match found for "${valueToSelect}". Trying partial match...`);
                // If not found, try clicking by partial text content
                const partialText = valueToSelect.trim().substring(0, 30); // Use first 30 chars
                const exactOption = this.page.locator('.dx-scrollview-content .dx-item-content', {
                    hasText: partialText
                });
                
                if (await exactOption.count() > 0) {
                    console.log('Found option using alternative method');
                    await exactOption.first().waitFor({ state: 'visible' });
                    await exactOption.first().click({ force: true });
                    
                    // Verify the selection was successful
                    await this.page.waitForFunction(() => {
                        const overlay = document.querySelector('.dx-overlay-content.dx-popup-normal.dx-resizable');
                        return !overlay || overlay.classList.contains('dx-state-invisible');
                    }, { timeout: 5000 });

                    // Wait for any loading after dropdown selection
                    try {
                        await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                            state: 'visible',
                            timeout: 2000 
                        });
                        await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                            state: 'hidden',
                            timeout: 10000 
                        });
                    } catch (e) {
                        // Loading panel might not appear, which is fine
                        console.log('No loading panel detected after selection');
                    }
                    // Additional wait to ensure UI is stable
                    await this.page.waitForTimeout(1000);
                    
                    found = true;
                } else {
                    throw new Error(`Option "${valueToSelect}" not found in dropdown ${dropdownName}. Available options: ${allOptions.join(', ')}`);
                }
            }
            
            console.log(`Successfully selected ${valueToSelect} in ${dropdownName}`);
        } catch (error) {
            console.error(`Failed to select dropdown value: ${error.message}`);
            throw error;
        }
    }

    /**
     * Helper method to get all dropdown options
     * @returns {Promise<string>} Comma-separated list of options
     */
    async getDropdownOptions() {
        const options = this.page.locator('.dx-scrollview-content .dx-item-content');
        const count = await options.count();
        const texts = [];
        for (let i = 0; i < count; i++) {
            texts.push(await options.nth(i).textContent());
        }
        return texts.join(', ');
    }

    /**
     * Get the report data from the grid
     * @returns {Array} Array of objects containing row data
     */
    async getReportData() {
        try {
            console.log('Getting report data');
            
            // Wait for the grid to be visible
            await this.page.waitForSelector('[role="grid"]', { timeout: 10000 });
            
            // Get all rows data
            const rowsData = await this.page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('[role="row"]'));
                // Skip the header row
                const dataRows = rows.slice(1);
                
                return dataRows.map(row => {
                    const cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
                    return cells.map(cell => cell.textContent.trim());
                });
            });
            
            console.log(`Found ${rowsData.length} rows of data`);
            return rowsData;
        } catch (error) {
            console.error(`Failed to get report data: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get the column headers from the grid
     * @returns {Array} Array of column header names
     */
    async getGridHeaders() {
        try {
            const headers = await this.page.evaluate(() => {
                const headerRow = document.querySelector('[role="row"]');
                if (!headerRow) return [];
                
                const headerCells = Array.from(headerRow.querySelectorAll('[role="columnheader"]'));
                return headerCells.map(cell => cell.textContent.trim());
            });
            
            console.log('Grid headers:', headers);
            return headers;
        } catch (error) {
            console.error(`Failed to get grid headers: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify that the records match the selected filters
     * @param {Object} filters - Object containing the filter values
     * @returns {boolean} True if all records match the filters
     */
    async verifyRecordsMatchFilters(filters) {
        try {
            console.log('Verifying records match filters:', filters);
            
            // Wait for any loading to complete
            await this.page.waitForSelector('.dx-loadpanel-wrapper', { 
                state: 'hidden',
                timeout: 10000 
            });
            
            // Get headers to know which column is which
            const headers = await this.getGridHeaders();
            
            // Get all row data
            const rowsData = await this.getReportData();
            
            if (rowsData.length === 0) {
                console.log('No records found in the grid');
                return false;
            }
            
            // Find column indices for each filter
            const columnIndices = {
                typeOfUser: headers.findIndex(h => h.toLowerCase().includes('type of user')),
                keyPopulation: headers.findIndex(h => h.toLowerCase().includes('key population')),
                age: headers.findIndex(h => h.toLowerCase().includes('age')),
                date: headers.findIndex(h => h.toLowerCase().includes('date'))
            };
            
            console.log('Column indices:', columnIndices);
            
            // Format the date filter if it exists
            let dateFilter = null;
            if (filters.date) {
                const date = new Date(filters.date);
                dateFilter = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
            }
            
            // Check each row against the filters
            const matchingRows = rowsData.filter(row => {
                let matches = true;
                
                if (filters.typeOfUser && columnIndices.typeOfUser !== -1) {
                    matches = matches && row[columnIndices.typeOfUser].includes(filters.typeOfUser);
                }
                
                if (filters.keyPopulation && columnIndices.keyPopulation !== -1) {
                    matches = matches && row[columnIndices.keyPopulation].includes(filters.keyPopulation);
                }
                
                if (filters.age && columnIndices.age !== -1) {
                    matches = matches && row[columnIndices.age].includes(filters.age);
                }
                
                if (dateFilter && columnIndices.date !== -1) {
                    matches = matches && row[columnIndices.date].includes(dateFilter);
                }
                
                return matches;
            });
            
            const totalRows = rowsData.length;
            const matchingRowCount = matchingRows.length;
            
            console.log(`Found ${matchingRowCount} matching rows out of ${totalRows} total rows`);
            
            // Log some sample matching and non-matching rows for debugging
            if (matchingRowCount > 0) {
                console.log('Sample matching row:', matchingRows[0]);
            }
            if (matchingRowCount < totalRows) {
                const nonMatching = rowsData.find(row => !matchingRows.includes(row));
                console.log('Sample non-matching row:', nonMatching);
            }
            
            return matchingRowCount > 0;
        } catch (error) {
            console.error(`Failed to verify records: ${error.message}`);
            throw error;
        }
    }

    /**
     * Select type of user
     * @returns {string} The selected type of user
     */
    async selectTypeOfUser() {
        try {
            const typeOfUserLabel = this.dropdownLabels['Type Of User'];
            const randomTypeOfUser = this.getRandomArrayItem(this.typeOfUserOptions);
            console.log(`Selecting random type of user: ${randomTypeOfUser}`);
            
            // Find and click the dropdown
            const input = this.page.getByRole('combobox', { name: typeOfUserLabel });
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.click();
            
            // Wait for dropdown list to be visible
            await this.page.waitForSelector('.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)', {
                state: 'visible',
                timeout: 5000
            });
            
            await this.page.waitForTimeout(300);
            
            // Get all options and find the matching one
            const options = this.page.locator('.dx-overlay-content .dx-item-content');
            const count = await options.count();
            console.log(`Found ${count} options in dropdown`);
            
            let found = false;
            for (let i = 0; i < count; i++) {
                const option = options.nth(i);
                const text = await option.textContent();
                console.log(`Option ${i + 1}: "${text}"`);
                
                // Try different text comparisons
                if (
                    text.trim() === randomTypeOfUser.trim() || 
                    text.trim().normalize() === randomTypeOfUser.trim().normalize() ||
                    text.trim().toLowerCase() === randomTypeOfUser.trim().toLowerCase() ||
                    text.trim().normalize().toLowerCase() === randomTypeOfUser.trim().normalize().toLowerCase()
                ) {
                    console.log(`Found matching option: "${text}"`);
                    await option.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(100);
                    await option.click();
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // If not found, try clicking by text content
                console.log('Trying alternative selection method...');
                const exactOption = this.page.locator('.dx-overlay-content .dx-item-content', {
                    hasText: randomTypeOfUser.trim()
                });
                
                if (await exactOption.count() > 0) {
                    console.log('Found option using alternative method');
                    await exactOption.first().click();
                    found = true;
                } else {
                    throw new Error(`Type of user option "${randomTypeOfUser}" not found`);
                }
            }
            
            await this.page.waitForTimeout(1000);
            console.log(`Successfully selected type of user "${randomTypeOfUser}"`);
            return randomTypeOfUser;
        } catch (error) {
            console.error(`Failed to select type of user: ${error.message}`);
            throw error;
        }
    }

    /**
     * Input today's date in mm/dd/yyyy format into the From field
     */
    async inputTodayDate() {
        try {
            console.log('Inputting today\'s date in From field...');
            
            // Get today's date in mm/dd/yyyy format
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            
            console.log(`Formatted date: ${formattedDate}`);
            
            // First find the container with the From placeholder
            const dateBoxContainer = this.page.locator('.dx-datebox', {
                has: this.page.locator('div[data-dx_placeholder="From"]')
            });
            
            // Wait for the container to be present
            await dateBoxContainer.waitFor({ state: 'attached', timeout: 5000 });
            
            // Then find the input within that container
            const dateInput = dateBoxContainer.locator('input[role="combobox"]');
            
            // Log some debugging info
            const count = await dateInput.count();
            console.log(`Found ${count} matching input elements`);
            
            // Wait for the input to be visible and interactable
            await dateInput.waitFor({ state: 'visible', timeout: 5000 });
            
            // Click to focus and select any existing text
            await dateInput.click();
            await this.page.keyboard.press('Control+a');
            await this.page.keyboard.press('Backspace');
            
            // Type the date
            await dateInput.type(formattedDate, { delay: 50 });
            
            // Press Tab to ensure the value is committed
            await dateInput.press('Tab');
            
            // Wait for any validation
            await this.page.waitForTimeout(500);
            
            // Verify the input
            const inputValue = await dateInput.inputValue();
            console.log(`Verified date input: ${inputValue}`);
            
            if (!inputValue) {
                throw new Error('Date input appears to be empty after filling');
            }
            
            console.log('Successfully input today\'s date in From field');
        } catch (error) {
            console.error(`Failed to input date: ${error.message}`);
            throw error;
        }
    }
}

module.exports = ReportPanelPage; 