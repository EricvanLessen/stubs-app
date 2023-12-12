import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const app = express();

// Promisify the exec function for async/await usage
const execAsync = promisify(exec);

const cors = require('cors');
app.use(cors());

// Endpoint to run the script
app.post('/run-script', async (req, res) => {
    const scriptPath = '/Users/ericvanlessen/Downloads/github/stubs-app/bash-script/registry.sh';

    try {
        // Make the script executable
        await execAsync(`chmod +x ${scriptPath}`);
        console.log('Script made executable.');

        // Run the bash script
        const { stdout } = await execAsync(`bash ${scriptPath}`);
        console.log('Script executed successfully.');

        res.json({ message: 'Script executed successfully', output: stdout });
    } catch (error) {
        console.error(`Script execution failed: ${error}`);
        res.status(500).json({ message: 'Script execution failed', error });
    }
});

app.post('/start-services', (req, res) => {
    exec('docker-compose -f /path/to/your/docker-compose.yml up -d', (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ message: "Failed to start services", error: err.message });
        }
        res.json({ message: "Services started successfully", output: stdout });
    });
});

app.post('/create-and-run-compose', async (req, res) => {
    try {
        const { composeContent } = req.body; // Directly using the received content
        const composePath = '/app/compose-files/docker-compose.yml';

        fs.writeFileSync(composePath, composeContent);

        // Execute Docker Compose up
        exec(`docker-compose -f ${composePath} up -d`, (err, stdout, stderr) => {
            if (err) {
                throw err;
            }
            res.json({ message: "Docker Compose executed", output: stdout });
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send({ message: "Error executing Docker Compose", error: errorMessage });
    }
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
