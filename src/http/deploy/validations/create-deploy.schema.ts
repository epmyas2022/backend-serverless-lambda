import * as z from "zod";

const deploySchemaImage = z.object({
  from: z.literal("image"),
  name: z.string().min(3).max(50),
  port: z.optional(z.number().min(1).max(65535)),
  image: z.string().min(3).max(100),
});

const deploySchemaDockerfile = z.object({
  from: z.literal("dockerFile"),
  name: z.string().min(3).max(50),
  port: z.optional(z.number().min(1).max(65535)),
  dockerfile: z.string().min(3).max(100),
  path: z.string().min(3).max(100),
});

export const createDeploySchema = z.discriminatedUnion("from", [
  deploySchemaImage,
  deploySchemaDockerfile,
]);
