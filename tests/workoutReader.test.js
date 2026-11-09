const path = require('path');
const fs = require('fs');
const { readWorkoutData, workoutCalculator } = require('../workoutReader');

// Create a path to the test CSV file.
const TEST_CSV_FILE = path.join(__dirname, 'test-workouts.csv');

// Create sample workout data for testing.
const testCsvData = `date,exercise,duration,calories
2024-01-01,Running,30,300
2024-01-02,Cycling,20,200
2024-01-03,Yoga,10,100`;

// Create the test file before running tests.
beforeAll(() => {
    fs.writeFileSync(TEST_CSV_FILE, testCsvData);
});

// Delete the test file after testing.
afterAll(() => {
    try {
        fs.unlinkSync(TEST_CSV_FILE);
    } catch {
        // It is okay if the file is already gone.
    }
});

// Test the workout reader functions.
describe('Workout CSV Processing', () => {

    test('reads a valid CSV file', async () => {
        const data = await readWorkoutData(TEST_CSV_FILE);

        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(3);
        expect(data[0]).toHaveProperty('exercise');
        expect(data[0]).toHaveProperty('duration');
    });

    test('counts workouts and calculates total minutes', async () => {
        const result = await workoutCalculator(TEST_CSV_FILE);

        expect(result).not.toBeNull();
        expect(result.totalWorkouts).toBe(3);
        expect(result.totalMinutes).toBe(60);
    });

    test('handles missing CSV files', async () => {
        const result = await workoutCalculator('missing-workouts.csv');

        expect(result).toBeNull();
    });

    test('handles missing files in readWorkoutData', async () => {
        await expect(
            readWorkoutData('missing-workouts.csv')
        ).rejects.toThrow();
    });

});
