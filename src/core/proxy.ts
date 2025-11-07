import { type Request, type Response } from "express";
import { createProxy, subdomainFromName } from "../utils/helper.ts";
import { DeployWithDocker } from "./deploy.ts";
import { startWorker } from "./worker.ts";
import { logger } from "../config/logger.ts";

const tempProject = new Map<
  string,
  { host: string; port: number; image: string }
>();

tempProject.set("welcome-to-docker", {
  host: "localhost",
  port: 8088,
  image: "docker/welcome-to-docker:latest",
});

export function proxyMiddleware(req: Request, res: Response, next: () => void) {
  const subdomain = subdomainFromName(req.hostname);

  if (!subdomain) {
    return next();
  }
  const project = tempProject.get(subdomain);

  if (!project) {
    return next();
  }

  const docker = DeployWithDocker.init();

  const target = `${project.host}:${project.port}`;

  const proxy = createProxy(target, false, async (_err, _req, _res) => {
    const exists = await docker.exists(subdomain);
    logger.info(`Container ${subdomain} exists: ${exists}`);
    if (!exists) {
      startWorker({
        name: subdomain,
        host: project.host,
        port: 80,
        image: project.image,
        externalPort: project.port,
      });
    }
  });

  docker.lifespan(subdomain);

  return proxy(req, res, next);
}
