const { exec } = require('child_process');

function runCommand(command, path = '.') {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
        });
    });
}

async function main() {
    const client = process.argv[2]; // 'web' or 'ios'

    if (!['web', 'ios'].includes(client)) {
        console.error('Please specify "web" or "ios" as an argument.');
        process.exit(1);
    }

    try {
        // Install dependencies in root
        console.log('Installing root dependencies...');
        await runCommand('npm install');

        // Navigate to .server directory and install dependencies
        console.log('Installing server dependencies...');
        await runCommand('npm install', './.server');

        // Start the server
        console.log('Starting the server...');
        const serverProcess = runCommand('node server.js', './.server');

        // Wait a bit to ensure server starts before the client
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Start the specified client (web or iOS)
        console.log(`Starting the ${client} client...`);
        await runCommand(`npm run ${client}`);

        // Keep the server running
        await serverProcess;
    } catch (error) {
        console.error('Failed to start the application:', error);
    }
}

main();
