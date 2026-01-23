import { spawn } from 'child_process';

console.log('Starting Next.js development server...');

const nextDev = spawn('npx', ['next', 'dev', '-p', '5000', '-H', '0.0.0.0'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

nextDev.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
});
