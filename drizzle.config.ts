import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { EnvironmentConfig } from './src/config/enviroment.config.ts';

export default defineConfig({
  out: './drizzle',
  schema: './src/schemas/**/*.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: EnvironmentConfig.DB_FILE_NAME,
  },
});
