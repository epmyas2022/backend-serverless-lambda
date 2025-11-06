import { parentPort } from "node:worker_threads";
import { logger } from "../config/logger.ts";
import type { ServerConfig } from "../common/interfaces/server.interface.ts";
import { DeployWithDocker } from "./deploy.ts";
import { RedisClient } from "../db/redis-client.ts";
import { StatusContainer } from "../common/constants/deploy.const.ts";

if (!parentPort) {
  logger.error("No parent port found for worker");
}

parentPort?.on("message", async (data: ServerConfig) => {
  logger.info("Attempting to start services...");

  const { name, port, image, externalPort } = data;

  await RedisClient.set(`status:${name}`, StatusContainer.STARTING);

  const docker = DeployWithDocker.init();

  const isRunning = await docker.isRunning(name);

  if (!isRunning) {
    await docker.run({
      image,
      name,
      ports: {
        [externalPort]: port.toString(),
      },
    });
  }

  await RedisClient.set(`status:${name}`, StatusContainer.RUNNING);

  // Responde con servidor iniciado con exito

  parentPort?.postMessage({
    text: `Service ${name} started successfully on port ${externalPort}`,
    status: true,
  });
});
