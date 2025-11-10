import { type Response, type Request } from "express";
import type { ZodObject, ZodUnion } from "zod";

function validateInput(
  schema: ZodObject | ZodUnion,
  data: any,
  { res, next }: { res: Response; next: Function }
) {
  const result = schema.safeParse(data);

  if (!result.success)
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });

  return next();
}

export const validator = {
  query: (schema: ZodObject | ZodUnion) => {
    return (req: Request, res: Response, next: Function) => {
      return validateInput(schema, req.query, { res, next });
    };
  },
  body: (schema: ZodObject | ZodUnion) => {
    return (req: Request, res: Response, next: Function) => {
      return validateInput(schema, req.body, { res, next });
    };
  },
  params: (schema: ZodObject | ZodUnion) => {
    return (req: Request, res: Response, next: Function) => {
      return validateInput(schema, req.params, { res, next });
    };
  },
};
