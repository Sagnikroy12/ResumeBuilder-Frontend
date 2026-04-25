import { execSync, spawn } from 'node:child_process';

const mode = process.argv[2] || 'dev';
const passthroughArgs = process.argv.slice(3);

const RENDER_API_URL = 'https://smartresumebuilder.onrender.com';
const LOCAL_API_URL = 'http://127.0.0.1:5000';
const PRODUCTION_BRANCHES = new Set(['main', 'master', 'production']);

const resolveCurrentBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

const resolveApiUrl = (branchName) => {
  if (process.env.VITE_API_BASE_URL && process.env.VITE_API_BASE_URL.trim()) {
    return process.env.VITE_API_BASE_URL;
  }
  return PRODUCTION_BRANCHES.has(branchName) ? RENDER_API_URL : LOCAL_API_URL;
};

const branchName = resolveCurrentBranch();
const apiUrl = resolveApiUrl(branchName);

const env = {
  ...process.env,
  VITE_API_BASE_URL: apiUrl,
  VITE_GIT_BRANCH: branchName,
};

console.log(
  `[branch-env] branch=${branchName || 'unknown'} -> VITE_API_BASE_URL=${apiUrl}`
);

const viteCommand =
  mode === 'build'
    ? `npx vite build ${passthroughArgs.join(' ')}`
    : mode === 'preview'
      ? `npx vite preview ${passthroughArgs.join(' ')}`
      : `npx vite ${passthroughArgs.join(' ')}`;

const child = spawn(viteCommand, {
  stdio: 'inherit',
  env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
