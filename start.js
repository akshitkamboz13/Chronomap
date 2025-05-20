const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Determine if we're on Windows
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('🚀 Starting ChronoMap Application...');
console.log('📡 Starting MongoDB...');
console.log('⚙️ Starting Server...');

// Start server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`\x1b[36m[SERVER]\x1b[0m ${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.error(`\x1b[31m[SERVER ERROR]\x1b[0m ${data.toString().trim()}`);
});

// Start client after server starts (giving server a head start)
setTimeout(() => {
  console.log('🌐 Starting Client...');
  
  const client = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'pipe',
    shell: true
  });

  // Handle client output
  client.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`\x1b[35m[CLIENT]\x1b[0m ${output}`);

    // Extract and highlight the local URL when Vite prints it
    if (output.includes('Local:') || output.includes('http://localhost')) {
      const urlMatch = output.match(/(https?:\/\/localhost:[0-9]+)/);
      if (urlMatch) {
        console.log(`\n🌎 ChronoMap is running at: \x1b[32m${urlMatch[0]}\x1b[0m\n`);
      }
    }
  });

  client.stderr.on('data', (data) => {
    console.error(`\x1b[31m[CLIENT ERROR]\x1b[0m ${data.toString().trim()}`);
  });

}, 2000); // 2 second delay before starting client

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ChronoMap application...');
  server.kill();
  client.kill();
  process.exit();
}); 