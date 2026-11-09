const path = require('path');
const fs = require('fs/promises');
const { healthMetricsCounter } = require('../healthReader');

// Create a path to the test JSON file.
const TEST_FILE = path.join(__dirname, 'test-health.json');

// Create sample health data for testing.
const testData = {
    user: 'TestUser',
    metrics: [
        { date: '2024-01-01', type: 'sleep', duration: '7.5' },
        { date: '2024-01-01', type: 'nutrition', calories: '2100' }
    ]
};

// Create the test file before running tests.
beforeAll(async () => {
    await fs.writeFile(TEST_FILE, JSON.stringify(testData));
});

// Delete the test file after testing.
afterAll(async () => {
    try {
        await fs.unlink(TEST_FILE);
    } catch {
        // It is okay if the file is already gone.
    }
});

// Test the health reader functions.
describe('healthMetricsCounter', () => {

    test('reads a valid JSON file and counts health entries', async () => {
        const result = await healthMetricsCounter(TEST_FILE);

        expect(result).toBe(2);
    });

    test('returns null when the file is missing', async () => {
        const result = await healthMetricsCounter('missing-health.json');

        expect(result).toBeNull();
    });

    test('returns null when the JSON file is invalid', async () => {
        const invalidFile = path.join(__dirname, 'invalid-health.json');

        await fs.writeFile(invalidFile, '{ invalid JSON }');

        const result = await healthMetricsCounter(invalidFile);

        expect(result).toBeNull();

        await fs.unlink(invalidFile);
    });

});
