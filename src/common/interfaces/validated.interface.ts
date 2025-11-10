import type { Request } from "express";
import * as z from "zod";

export interface ValidatedRequestQuery<T extends z.ZodObject | z.ZodUnion> extends Request<any, any, any, z.infer<T>> {
  query: z.infer<T>;
}

export interface ValidatedRequestBody<T extends z.ZodObject | z.ZodUnion> extends Request {
  body: z.infer<T>;
}

export interface ValidatedRequestParams<T extends z.ZodObject | z.ZodUnion> extends Request<z.infer<T>, any, any> {
  params: z.infer<T>;
}



