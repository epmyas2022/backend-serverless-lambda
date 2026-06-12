import { describe, it, expect } from "vitest";

import type { createDeploySchema } from "../src/http/deploy/validations/create-deploy.schema.ts";
import { localUrl } from "../src/utils/helper.ts";
import { z } from "zod";
import { RedisClient } from "../src/db/redis-client.ts";
import { DeployWithDocker } from "../src/core/deploy.ts";

const request = async (
  schema: z.infer<typeof createDeploySchema>,
): Promise<{
  success: boolean;
}> => {
  const response = await fetch(`${localUrl("127.0.0.1")}api/deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schema),
  });

  return {
    success: response.ok,
  };
};

describe("Deploy", () => {
  it("should deploy with condition race", async () => {
    RedisClient.flushAll();
    DeployWithDocker.init()
      .setRedisClient(RedisClient)
      .delete("my-serverless-app-worker");

    const result = await Promise.all([
      request({
        from: "image",
        name: "my-serverless-app-worker",
        port: 5173,
        image: "epmyas2022/mountains:0.1.0-prerelease3",
      }),

      request({
        from: "image",
        name: "my-serverless-app-worker",
        port: 5173,
        image: "epmyas2022/mountains:0.1.0-prerelease3",
      }),

      request({
        from: "image",
        name: "my-serverless-app-worker",
        port: 5173,
        image: "epmyas2022/mountains:0.1.0-prerelease3",
      }),
    ]);

    expect(result).toEqual([
      { success: true },
      { success: true },
      { success: true },
    ]);
  });
});
