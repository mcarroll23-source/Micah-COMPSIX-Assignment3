// Import the file system module.
const fs = require('fs');

// Import the csv-parser package.
const csv = require('csv-parser');

// This function reads CSV workout data asynchronously.
function readWorkoutData(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];

        // Create a stream to read the CSV file.
        const stream = fs.createReadStream(filepath);

        // Handle errors when opening the file.
        stream.on('error', (error) => {
            reject(error);
        });

        // Read and process each CSV row.
        stream.pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// This function counts workouts and calculates total minutes.
async function workoutCalculator(filepath) {
    try {
        // Read the workout data.
        const workouts = await readWorkoutData(filepath);

        // Count the total number of workouts.
        const totalWorkouts = workouts.length;

        // Start the total minutes at zero.
        let totalMinutes = 0;

        // Add the duration of each workout.
        for (let i = 0; i < workouts.length; i++) {
            const workout = workouts[i];

            totalMinutes += parseFloat(workout.duration);
        }

        // Return the workout results.
        return { totalWorkouts, totalMinutes };

    } catch (error) {
        // Handle missing files.
        if (error.code === 'ENOENT') {
            console.log('Workout file not found - check the file path');
        } else {
            console.log('Error processing workout data:', error.message);
        }

        return null;
    }
}

// Export both functions so other files can use them.
module.exports = { readWorkoutData, workoutCalculator };
