import { DeployWithDocker } from "./core/deploy.ts";
import { getFileAssets } from "./utils/files.ts";

async function loadBanner() {
  const banner = await getFileAssets("./assets/banner.txt");
  console.log(banner);
}

async function main() {
  loadBanner();
  new DeployWithDocker();
}

main();
