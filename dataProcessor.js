// Load environment variables from the .env file.
require('dotenv').config();

// Import the health and workout reader functions.
const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

// This function processes the health and workout files.
async function processFiles() {
    try {
        // Get the environment variables.
        const userName = process.env.USER_NAME;
        const weeklyGoal = Number(process.env.WEEKLY_GOAL);

        // Check that the environment variables exist.
        if (!userName || !Number.isFinite(weeklyGoal) || weeklyGoal <= 0) {
            console.log('Please check your environment variables.');
            return;
        }

        console.log(`Processing data for: ${userName}`);

        // Read the workout data.
        console.log('Reading workout data...');
        const workoutData = await workoutCalculator('./data/workouts.csv');

        if (workoutData === null) {
            console.log('Unable to process workout data.');
            return;
        }

        console.log('Total workouts:', workoutData.totalWorkouts);
        console.log('Total minutes:', workoutData.totalMinutes);

        // Read the health data.
        console.log('Reading health data...');
        const healthEntries = await healthMetricsCounter('./data/health-metrics.json');

        if (healthEntries === null) {
            console.log('Unable to process health data.');
            return;
        }

        console.log('Total health entries:', healthEntries);

        // Display the final summary.
        console.log('\n=== SUMMARY ===');
        console.log('Workouts found:', workoutData.totalWorkouts);
        console.log('Total workout minutes:', workoutData.totalMinutes);
        console.log('Health entries found:', healthEntries);
        console.log('Weekly goal:', weeklyGoal, 'minutes');

        // Check whether the weekly goal has been reached.
        if (workoutData.totalMinutes >= weeklyGoal) {
            console.log(`Congratulations ${userName}! You have met your weekly goal!`);
        } else {
            console.log(`Keep going ${userName}! You still need ${weeklyGoal - workoutData.totalMinutes} minutes to reach your weekly goal.`);
        }

    } catch (error) {
        console.log('An error occurred while processing your files:', error.message);
    }
}

// Run the main program.
processFiles();
