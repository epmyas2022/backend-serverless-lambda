import { parentPort } from "node:worker_threads";
import { logger } from "../config/logger.ts";
import type {
  ServerConfigDockerFile,
  ServerConfigImage,
} from "../common/interfaces/server.interface.ts";
import { DeployWithDocker } from "./deploy.ts";
import { RedisClient } from "../db/redis-client.ts";
import { StatusContainer } from "../common/constants/deploy.const.ts";
import { DatabaseClient } from "../db/database-client.ts";
import { servicesTable } from "../schemas/service.schema.ts";
import { sleep } from "../utils/helper.ts";

if (!parentPort) {
  logger.error("No parent port found for worker");
}

parentPort?.on(
  "message",
  async (data: ServerConfigDockerFile | ServerConfigImage) => {
    logger.info("Attempting to start services...");
    const { name, port, externalPort, from } = data;

    const status = await RedisClient.get(`status:${name}`);

    if (status === StatusContainer.STARTING) {
      logger.warn(
        `Blocked potencial condition race for worker: ${name}`
      );
      return;
    }

    await RedisClient.set(`status:${name}`, StatusContainer.STARTING);

    await sleep(10000); // simulate condition race

    const docker = DeployWithDocker.init();

    const isRunning = await docker.isRunning(name);
    let imageSaved = null;

    if (!isRunning && from === "dockerFile") {
      const {
        path,
        dockerFilePath: dockerfile = "./Dockerfile",
        environments = {},
      } = data;
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
        ports: {
          [externalPort]: port.toString(),
        },
      });
      imageSaved = data.imageName;
    }

    if (imageSaved)
      await DatabaseClient.insert(servicesTable)
        .values({
          name,
          image: imageSaved,
          externalPort,
          port,
        })
        .onConflictDoUpdate({
          target: servicesTable.name,
          set: {
            image: imageSaved,
            externalPort,
            port,
          },
        });

    await RedisClient.set(`status:${name}`, StatusContainer.RUNNING);
  }
);
