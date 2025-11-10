import { EnvironmentConfig } from "../config/enviroment.config.ts";

import { drizzle } from "drizzle-orm/libsql";

export const DatabaseClient = drizzle(EnvironmentConfig.DB_FILE_NAME);


