import { Router } from "express";
import deployController from "../http/deploy/controllers/deploy.controller.ts";
import { validator } from "../core/validator.ts";
import { createDeploySchema } from '../http/deploy/validations/create-deploy.schema.ts';

const router = Router();

router.get("/deploy", deployController.get);
router.post("/deploy", validator.body(createDeploySchema), deployController.post);

export default router;
