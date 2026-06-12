import { parentPort } from "node:worker_threads";
import { logger } from "../config/logger.ts";
import type {
  ServerConfigDockerFile,
  ServerConfigImage,
} from "../common/interfaces/server.interface.ts";
import { DeployWithDocker } from "./deploy.ts";
import { RedisClient } from "../db/redis-client.ts";
import { DatabaseClient } from "../db/database-client.ts";
import { servicesTable } from "../schemas/service.schema.ts";
import crypto from "node:crypto";

if (!parentPort) {
  logger.error("No parent port found for worker");
}

parentPort?.on(
  "message",
  async (data: ServerConfigDockerFile | ServerConfigImage) => {
    logger.info("Attempting to start services...");
    const { name, port, from, environments = {} } = data;
    try {
      const processUuid = crypto.randomUUID().slice(0, 4);

      const docker = DeployWithDocker.init(processUuid);

      docker.setRedisClient(RedisClient);

      const isRunning = await docker.isRunning(name);
      let imageSaved = null;

      if (!isRunning && from === "dockerFile") {
        const { path, dockerFilePath: dockerfile = "./Dockerfile" } = data;
        imageSaved = await docker.build({
          path,
          dockerfile,
          name,
          environments,
        });
      }

      if (!isRunning && from === "image") {
        await docker.run({
          image: data.imageName,
          name,
          environments,
          ports: { [port]: port.toString() },
        });
        imageSaved = data.imageName;
      }

      if (imageSaved)
        await DatabaseClient.insert(servicesTable)
          .values({
            name,
            image: imageSaved,
            port,
            environments: JSON.stringify(environments),
          })
          .onConflictDoUpdate({
            target: servicesTable.name,
            set: {
              image: imageSaved,
              port,
            },
          });
    } catch (error) {
      throw error;
    }
  },
);
