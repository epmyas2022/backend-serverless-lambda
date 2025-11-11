import { logger } from "./config/logger.ts";
import { getFileAssets } from "./utils/files.ts";
import express from "express";
import { localUrl } from "./utils/helper.ts";
import { proxyMiddleware } from "./core/proxy.ts";
import deployRouter from "./routes/deploy.router.ts";

async function loadBanner() {
  const banner = await getFileAssets("./assets/banner.txt");
  process.stderr.write("\n" + banner + "\n");
}

async function main() {
  await loadBanner();

  const app = express();

  app.use(express.json());

  app.use(proxyMiddleware);

  app.use("/api", deployRouter);

  app.get("/", (_req, res) => res.send("Serverless Lambda is running"));

  app.listen(80, (error) => {
    if (error) {
      logger.error("Error starting serverless app:" + error);
      return;
    }
    logger.info(`Serverless app is running on ${localUrl("127.0.0.1")}`);
  });
}

await main();
