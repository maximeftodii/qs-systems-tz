require('dotenv').config();
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const BarrierFormPage = require('../pages/BarrierFormPage');
const ReportPanelPage = require('../pages/ReportPanelPage');

test('Login and navigate through application', async ({ page }) => {
    let selectedValues = {
        typeOfUser: null,
        identity: null,
        ageGroup: null
    };

    const loginPage = new LoginPage(page);
    const barrierFormPage = new BarrierFormPage(page);
    const reportPanelPage = new ReportPanelPage(page);

    await test.step('Navigate to application', async () => {
        await page.goto(loginPage.baseUrl);
    });

    await test.step('Login to application', async () => {
        await loginPage.login();
    });

    await test.step('Verify successful login', async () => {
        expect(await loginPage.isLoggedIn()).toBeTruthy();
    });

    await test.step('Set interface language to English', async () => {
        await barrierFormPage.setLanguage('en');
    });

    await test.step('Open barriers reporting menu', async () => {
        await barrierFormPage.clickBarriersMenu('en');
    });

    await test.step('Open anonymous reporting page', async () => {
        await barrierFormPage.clickAnonymousReporting('en');
    });

    await test.step('Click Add button', async () => {
        await barrierFormPage.clickAddButton('en');
    });

    await test.step('Select rights option', async () => {
        await barrierFormPage.clickRightsButton();
    });

    await test.step('Fill in form fields and store values', async () => {
        selectedValues.ageGroup = await barrierFormPage.selectAgeGroup('en');
        await barrierFormPage.selectGender('en');
        selectedValues.identity = await barrierFormPage.selectIdentity('en');
        await barrierFormPage.selectLocation('en');
        await barrierFormPage.selectLocationType('en');
        await barrierFormPage.selectStudiesLevel('en');
        selectedValues.typeOfUser = await barrierFormPage.selectTypeOfUser('en');
        await barrierFormPage.inputPhoneNumber('en');
        await barrierFormPage.selectRandomTBBarriers();
    });

    await test.step('Navigate to Report Panel and Demographic Communities', async () => {
        await reportPanelPage.navigateToDemographicCommunities('en');
    });

    await test.step('Verify selected values in reports', async () => {
        await reportPanelPage.selectDropdownValue('Type Of User', selectedValues.typeOfUser);
        await reportPanelPage.selectDropdownValue('Key population', selectedValues.identity);
        await reportPanelPage.selectDropdownValue('Age', selectedValues.ageGroup);
        await page.waitForTimeout(2000);
        const reportData = await reportPanelPage.getReportData();
        expect(reportData.length).toBeGreaterThan(0);
        await reportPanelPage.inputTodayDate();
        const filters = {
            typeOfUser: selectedValues.typeOfUser,
            keyPopulation: selectedValues.identity,
            age: selectedValues.ageGroup,
            date: new Date()
        };

        const recordsMatch = await reportPanelPage.verifyRecordsMatchFilters(filters);
        expect(recordsMatch).toBeTruthy();
    });
});
