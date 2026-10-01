import {Router} from "express";
import { getProductKPIsController } from "./dashboard.controller.js";

const router = Router();

router.get(
  "/products/kpis",
  getProductKPIsController,
);

export default router