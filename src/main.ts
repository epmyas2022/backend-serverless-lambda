import { DeployWithDocker } from "./core/deploy.ts";
import { getFileAssets } from "./utils/files.ts";

async function loadBanner() {
  const banner = await getFileAssets("./assets/banner.txt");
  console.log(banner);
}

async function main() {
  loadBanner();
  ((await DeployWithDocker.init()).build({
    dockerfile: ".docker/Dockerfile",
    path: "C:\\Users\\casti\\Desktop\\web\\serverless\\template-example",
    name: "my-serverless-app:latest",
    environments: {
      NODE_ENV: "production",
    },
  }))
}

main();
