require('dotenv').config();
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const BarrierFormPage = require('../pages/BarrierFormPage');
const ReportPanelPage = require('../pages/ReportPanelPage');
const { LANGUAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * QS Systems Application Test - English Language Only
 * Tests the complete flow: Login -> Form submission -> Report verification
 * Language: English (en)
 */
test.describe('QS Systems Application - English Language Test', () => {
    let loginPage, barrierFormPage, reportPanelPage;
    let selectedValues = {};

    test.beforeEach(async ({ page }) => {
        // Initialize page objects
        loginPage = new LoginPage(page);
        barrierFormPage = new BarrierFormPage(page);
        reportPanelPage = new ReportPanelPage(page);
        
        // Reset selected values
        selectedValues = {
            typeOfUser: null,
            identity: null,
            ageGroup: null
        };
        
        logger.info('Test setup completed - English language only');
    });

    test('Complete workflow: Login → Barrier Form → Report Verification (English)', async ({ page }) => {
        await test.step('Navigate to application', async () => {
            await loginPage.navigateTo(loginPage.baseUrl);
        });

        await test.step('Login to application', async () => {
            await loginPage.login();
        });

        await test.step('Verify successful login', async () => {
            const isLoggedIn = await loginPage.isLoggedIn();
            expect(isLoggedIn).toBeTruthy();
        });

        await test.step('Set interface language to English', async () => {
            await barrierFormPage.setLanguage(LANGUAGES.ENGLISH);
            logger.info('Language set to English for the entire test');
        });

        await test.step('Navigate to barriers reporting', async () => {
            await barrierFormPage.clickBarriersMenu();
            await barrierFormPage.clickAnonymousReporting();
        });

        await test.step('Start new barrier report', async () => {
            await barrierFormPage.clickAddButton();
            await barrierFormPage.clickRightsButton();
        });

        await test.step('Fill barrier form with random data', async () => {
            // Fill form fields and store selected values for verification
            selectedValues.ageGroup = await barrierFormPage.selectAgeGroup();
            await barrierFormPage.selectGender();
            selectedValues.identity = await barrierFormPage.selectIdentity();
            await barrierFormPage.selectLocation();
            await barrierFormPage.selectLocationType();
            await barrierFormPage.selectStudiesLevel();
            selectedValues.typeOfUser = await barrierFormPage.selectTypeOfUser();
            await barrierFormPage.inputPhoneNumber();
            
            // Select TB barriers and complete form
            await barrierFormPage.selectRandomTBBarriers();
            
            logger.info('Form filled with selected values', selectedValues);
        });

        await test.step('Navigate to demographic communities report', async () => {
            await reportPanelPage.navigateToDemographicCommunities();
        });

        await test.step('Verify form data appears in reports', async () => {
            // Apply filters based on submitted form data
            await reportPanelPage.selectDropdownValue('Type Of User', selectedValues.typeOfUser);
            await reportPanelPage.selectDropdownValue('Key population', selectedValues.identity);
            await reportPanelPage.selectDropdownValue('Age', selectedValues.ageGroup);
            
            // Wait for report to update
            await page.waitForTimeout(2000);
            
            // Verify report contains data
            const reportData = await reportPanelPage.getReportData();
            expect(reportData.length).toBeGreaterThan(0);
            
            logger.info('Report verification completed', { 
                recordsFound: reportData.length,
                filters: selectedValues 
            });
        });

        await test.step('Verify date filter functionality', async () => {
            await reportPanelPage.inputTodayDate();

            const filters = {
                typeOfUser: selectedValues.typeOfUser,
                keyPopulation: selectedValues.identity,
                age: selectedValues.ageGroup,
                date: new Date()
            };

            const recordsMatch = await reportPanelPage.verifyRecordsMatchFilters(filters);
            expect(recordsMatch).toBeTruthy();
            
            logger.info('Date filter verification completed', { filtersApplied: filters });
        });
    });

    test.afterEach(async ({ page }) => {
        // Cleanup after each test
        logger.info('Test cleanup completed');
    });
});
