import { createClient } from "redis";
import { EnvironmentConfig } from "../config/enviroment.config.ts";
import { logger } from "../config/logger.ts";

const client = await createClient({
  url: EnvironmentConfig.REDIS_URL,
})
  .on("error", (err) => logger.error("Redis Client Error: " + err))
  .connect();

if (await client.ping()) logger.info("Redis client connected");

export const RedisClient = client;
