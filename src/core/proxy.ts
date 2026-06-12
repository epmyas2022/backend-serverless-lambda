import { type Request, type Response } from "express";
import { createProxy, subdomainFromName } from "../utils/helper.ts";
import { DeployWithDocker } from "./deploy.ts";
import { startWorker } from "./worker.ts";
import { DatabaseClient } from "../db/database-client.ts";
import { servicesTable } from "../schemas/service.schema.ts";
import { eq } from "drizzle-orm";
import { RedisClient } from "../db/redis-client.ts";

export async function proxyMiddleware(
  req: Request,
  res: Response,
  next: () => void
) {
  const subdomain = subdomainFromName(req.hostname);

  if (!subdomain) {
    return next();
  }
  const project = await DatabaseClient.select()
    .from(servicesTable)
    .where(eq(servicesTable.name, subdomain))
    .get();

  if (!project) {
    return next();
  }

  const docker = DeployWithDocker.init();

  docker.setRedisClient(RedisClient);

  const target = `${subdomain}:${project.port}`;

  const environments = project.environments ? JSON.parse(project.environments) : {};

  const proxy = createProxy(target, false, async (_err, _req, _res) => {
    const exists = await docker.exists(subdomain);
    if (!exists) {
      await startWorker({
        from: "image",
        name: subdomain,
        port: project.port,
        imageName: project.image,
        environments,
      });
    }
  });

  docker.lifespan(subdomain);

  return proxy(req, res, next);
}
