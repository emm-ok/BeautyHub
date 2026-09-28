import { Router } from "express";

import { productDiscoveryController } from "./product-discovery.controller.js";

const router = Router();

router.post("/",productDiscoveryController);

export default router;