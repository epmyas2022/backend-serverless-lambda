import { parentPort } from "node:worker_threads";
import { logger } from "../config/logger.ts";
import type { ServerConfig } from "../common/interfaces/server.interface.ts";
import { DeployWithDocker } from "./deploy.ts";
import { randomPort } from "../utils/helper.ts";

if (!parentPort) {
  logger.error("No parent port found for worker");
}

parentPort?.on("message", async (data: ServerConfig) => {
  logger.info("Attempting to start services...");

  const { name, port, image } = data;

  const externalPort = randomPort().toString();

  const docker = DeployWithDocker.init();

  const isRunning = await docker.isRunning(name);
  const isStopped = await docker.isStopped(name);

  if (isStopped) {
    await docker.start(name);
  }

  if (!isRunning)
    await docker.run({
      image,
      name,
      ports: {
        [externalPort]: port.toString(),
      },
    });

  // Responde con servidor iniciado con exito
  parentPort?.postMessage(`server service work: ` + name);
});
