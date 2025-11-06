import { type Request, type Response } from "express";
import { createProxy, subdomainFromName } from "../utils/helper.ts";
import { DeployWithDocker } from "./deploy.ts";

const tempProject = new Map<string, { host: string; port: number }>();

tempProject.set("welcome-to-docker", { host: "localhost", port: 8088 });

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
    if (await docker.isStopped(subdomain)) {
      await docker.start(subdomain);
    }
  });

  docker.lifespan(subdomain);

  return proxy(req, res, next);
}
