// Import the promise-based file system module.
const fs = require('fs/promises');

// This function reads JSON health data and counts the total entries.
async function healthMetricsCounter(filepath) {
    try {
        // Read the JSON file asynchronously.
        const data = await fs.readFile(filepath, 'utf8');

        // Convert the JSON text into a JavaScript object.
        const healthData = JSON.parse(data);

        // Check that the metrics property contains an array.
        if (!Array.isArray(healthData.metrics)) {
            throw new Error('Invalid health data format');
        }

        // Count the total number of health entries.
        const totalHealthEntries = healthData.metrics.length;

        return totalHealthEntries;

    } catch (error) {
        // Handle missing files.
        if (error.code === 'ENOENT') {
            console.log('Health file not found - check the file path');

        // Handle invalid JSON.
        } else if (error instanceof SyntaxError) {
            console.log('Invalid JSON - check the file format');

        // Handle other errors.
        } else {
            console.log('Error reading health data:', error.message);
        }

        return null;
    }
}

// Export the function so other files can use it.
module.exports = { healthMetricsCounter };
