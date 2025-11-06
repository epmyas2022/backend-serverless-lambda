import { Worker } from "node:worker_threads";
import { logger } from "../config/logger.ts";
import type { ServerConfig } from "../common/interfaces/server.interface.ts";

export async function startWorker(workerData: ServerConfig): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const worker = new Worker(new URL("./server.ts", import.meta.url), {
        workerData,
        execArgv: ["-r", "ts-node/register"],
      });

      worker.postMessage(workerData);

      worker.on("message", (message: { text: string; status: boolean }) => {
        const { text } = message;

        logger.info("Message from worker:" + text);
      });

      worker.on("error", (error) => {
        logger.error("Worker error:" + error);
        worker.terminate();
      });

      worker.on("exit", (code) => {
        logger.info("Worker exited with code:" + code);
      });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
