import { startWorker } from "../../../core/worker.ts";
import type { Response } from "express";
import type { ValidatedRequestBody } from "../../../common/interfaces/validated.interface.ts";
import type { createDeploySchema } from "../validations/create-deploy.schema.ts";
import { localUrl } from "../../../utils/helper.ts";
/* 
await startWorker({
    name: "my-serverless-app-worker",
    host: "0.0.0.0",
    port: 80,
    image: "docker/welcome-to-docker:latest",
  });
  await startWorker({
    name: "my-serverless-app-worker-2",
    host: "0.0.0.0",
    port: 80,
    image: "docker/welcome-to-docker:latest",
  }); */

/*   ( DeployWithDocker.init()).run({
    image: "docker/welcome-to-docker:latest",
    name: "my-serverless-app-container",
    ports: {
      "8091": "80",
    },
  }); */
/* ((await DeployWithDocker.init()).build({
    dockerfile: ".docker/Dockerfile",
    path: "C:\\Users\\casti\\Desktop\\web\\serverless\\template-example",
    name: "my-serverless-app:latest",
    environments: {
      NODE_ENV: "production",
    },
  })) */
function get() {
  return "deploy controller all";
}

async function post(
  request: ValidatedRequestBody<typeof createDeploySchema>,
  response: Response
) {
  const { name, host, port, image } = request.body;

  //TODO: consytruir imagen del proyecto si no existe y guardar informacion en BD
  /*   await startWorker({
    name,
    image,
    host: host || "0.0.0.0",
    port: port || 80,
    externalPort: 8088,
  }); */

  return response.status(201).json({
    message: "Worker started successfully",
    url: localUrl("127.0.0.1", name),
  });
}

export default {
  get,
  post,
};
