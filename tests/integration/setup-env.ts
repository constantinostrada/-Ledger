import fs from 'fs';
import path from 'path';

// Integration tests exercise the real DI container (Prisma + JWT), which
// reads its configuration from the environment when route modules load.
// Populate process.env from the project's .env before any test imports a
// route; fall back to the local docker-compose defaults so a bare checkout
// with the database running still works.
const FALLBACKS: Record<string, string> = {
  DATABASE_URL:
    'postgresql://ledger_user:ledger_password@localhost:5439/ledger_db',
  JWT_SECRET: 'integration-test-secret',
};

const envFile = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

for (const [key, value] of Object.entries(FALLBACKS)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
