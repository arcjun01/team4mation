import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

const runMigration = async (action = 'up') => {
  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (files.length === 0) {
      console.log('No migration files found');
      return;
    }

    for (const file of files) {
      const migration = await import(`./migrations/${file}`);
      const migrationAction = migration[action];

      if (typeof migrationAction === 'function') {
        console.log(`Running ${action} for ${file}...`);
        await migrationAction();
      }
    }

    console.log(`✓ All migrations ${action} completed`);
  } catch (error) {
    console.error(`✗ Migration error:`, error);
    process.exit(1);
  }
};

// Get action from command line arguments
const action = process.argv[2] || 'up';

if (action === 'up' || action === 'down') {
  runMigration(action);
} else {
  console.error(`Unknown action: ${action}. Use 'up' or 'down'`);
  process.exit(1);
}
