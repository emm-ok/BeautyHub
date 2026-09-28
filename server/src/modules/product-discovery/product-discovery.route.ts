import { Router } from "express";

import { productDiscoveryController } from "./product-discovery.controller.js";

const router = Router();

router.post("/discover",productDiscoveryController);

export default router;