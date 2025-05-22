# QS Systems UI Automation Test

This project contains automated UI tests for the QS Systems application using Playwright.

## Prerequisites

1. Node.js (version 14 or higher)
2. npm (comes with Node.js)

## Setup

1. Install Node.js from https://nodejs.org/

2. Clone this repository and install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create a `.env` file in the root directory with your credentials:
```
QS_USERNAME=your_username
QS_PASSWORD=your_password
```

## Running Tests

To run tests in headed mode (with browser visible):
```bash
npm run test:headed
```

To run tests in headless mode:
```bash
npm run test
```

To view the test report:
```bash
npm run report
```

## Test Structure

The test suite includes:
1. Authorization in the system
2. Creating an anonymous survey
3. Verifying the created record in demographic communities report

## Notes

- The test uses environment variables for credentials
- Screenshots and videos are captured on test failures
- HTML report is generated after test execution 