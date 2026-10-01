import type { Request, Response } from "express";

import {
  getProductKPIs,
} from "./dashboard.service.js";

export async function getProductKPIsController(
  _req: Request,
  res: Response,
) {
  const data = await getProductKPIs();

  return res.status(200).json({
    success: true,
    data,
  });
}