import { Router } from "express";

import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";
import { requireAuthentication } from "../../middleware/auth.middleware.js";


const router = Router();

router.use(requireAuthentication);

router.get(
  "/",
  getCartController
);

router.post(
  "/items",
  addCartItemController
);

router.patch(
  "/items/:itemId",
  updateCartItemController
);

router.delete(
  "/items/:itemId",
  removeCartItemController
);

router.delete(
  "/",
  clearCartController
);

export default router;