import * as z from "zod";

export const createDeploySchema = z.object({
  name: z.string().min(3).max(50),
  host: z.optional(z.string().min(3).max(100)),
  port: z.optional(z.number().min(1).max(65535)),
  image: z.string().min(3).max(100),
});
