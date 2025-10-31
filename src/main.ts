import { startWorker } from "./core/worker.ts";
import { getFileAssets } from "./utils/files.ts";

async function loadBanner() {
  const banner = await getFileAssets("./assets/banner.txt");
  process.stderr.write(banner + "\n");
}

async function main() {
  await loadBanner();

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
  });

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
}

await main();
