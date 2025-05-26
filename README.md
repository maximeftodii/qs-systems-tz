# QS Systems UI Automation Test Suite

A comprehensive automated testing suite for the QS Systems application using Playwright. This project tests the complete workflow of barrier reporting and demographic analysis features.

## 🚀 Features

- **Complete E2E Testing**: Tests the full user journey from login to report verification
- **Page Object Model**: Well-structured and maintainable test architecture
- **Robust Error Handling**: Comprehensive logging and error management
- **Cross-browser Support**: Configurable browser testing
- **Detailed Reporting**: HTML reports with screenshots and traces
- **Environment Configuration**: Flexible configuration management

## 📋 Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🛠️ Setup

### 1. Install Node.js
Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd qs-systems-test

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### 3. Environment Configuration
Create a `.env` file in the root directory with your credentials:

```env
# Required: Login credentials
EMAIL=your_email@example.com
PASSWORD=your_password

# Optional: Logging configuration
LOG_LEVEL=info
```

**⚠️ Security Note**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

## 🧪 Running Tests

### Basic Test Execution
```bash
# Run tests in headless mode
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with debugging
npm run test:debug

# Run tests with UI mode (interactive)
npm run test:ui
```

### Advanced Test Options
```bash
# Run with trace recording
npm run test:trace

# Run specific test file
npx playwright test tests/test.spec.js

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in CI mode
npm run test:ci
```

### Viewing Reports
```bash
# Open HTML report
npm run report

# Open report on specific host/port
npm run report:open
```

## 📁 Project Structure

```
qs-systems-test/
├── pages/                  # Page Object Model classes
│   ├── BasePage.js        # Base page with common functionality
│   ├── LoginPage.js       # Login page interactions
│   ├── BarrierFormPage.js # Barrier form interactions
│   └── ReportPanelPage.js # Report panel interactions
├── tests/                 # Test specifications
│   └── test.spec.js      # Main test suite
├── utils/                 # Utility functions and helpers
│   ├── constants.js      # Application constants
│   ├── helpers.js        # Helper functions
│   ├── logger.js         # Logging utility
│   ├── global-setup.js   # Global test setup
│   └── global-teardown.js # Global test cleanup
├── test-results/         # Test execution results
├── playwright-report/    # HTML test reports
├── playwright.config.js  # Playwright configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration

### Playwright Configuration
The `playwright.config.js` file contains:
- Test timeouts and retries
- Browser configurations
- Report settings
- Global setup/teardown

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EMAIL` | Login email | Yes | - |
| `PASSWORD` | Login password | Yes | - |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | No | info |

## 📊 Test Coverage

The test suite covers:

1. **Authentication Flow**
   - User login with credentials
   - Login validation
   - Session management

2. **Barrier Reporting**
   - Form navigation
   - Data input and validation
   - Random data generation
   - Form submission

3. **Report Verification**
   - Report panel navigation
   - Filter application
   - Data verification
   - Date filtering

## 🐛 Debugging

### Debug Mode
```bash
# Run in debug mode with browser DevTools
npm run test:debug
```

### Trace Viewer
```bash
# Generate traces for failed tests
npm run test:trace

# View traces in Playwright trace viewer
npx playwright show-trace test-results/trace.zip
```

### Logging
Set `LOG_LEVEL=debug` in your `.env` file for detailed logging:
```env
LOG_LEVEL=debug
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   ```
   Error: EMAIL and PASSWORD environment variables are required
   ```
   **Solution**: Ensure `.env` file exists with correct credentials

2. **Browser Not Found**
   ```
   Error: Browser not found
   ```
   **Solution**: Run `npm run install:browsers`

3. **Test Timeouts**
   ```
   Error: Test timeout exceeded
   ```
   **Solution**: Check network connectivity and increase timeouts in config

4. **Element Not Found**
   ```
   Error: Element not visible
   ```
   **Solution**: Check if application UI has changed, update selectors

### Getting Help
- Check the [Playwright documentation](https://playwright.dev/)
- Review test logs in `test-results/`
- Enable debug logging for more details

## 🔄 Maintenance

### Updating Dependencies
```bash
# Update all dependencies
npm update

# Update Playwright specifically
npm install @playwright/test@latest
npm run install:browsers
```

### Code Quality
```bash
# Clean previous test results
npm run clean

# Run linting (when configured)
npm run lint
```

## 📈 CI/CD Integration

For continuous integration, use:
```bash
npm run test:ci
```

This generates JUnit XML reports suitable for CI systems.

## 🤝 Contributing

1. Follow the existing code structure
2. Add appropriate logging
3. Update tests when adding new features
4. Ensure all tests pass before committing

## 📄 License

This project is licensed under the ISC License.
