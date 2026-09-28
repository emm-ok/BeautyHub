import { Router } from "express";

import {
  deleteProductImageController,
  getProductImagesController,
  reorderProductImagesController,
  setPrimaryProductImageController,
  uploadProductImageController,
} from "./product-image.controller.js";

import { uploadProductImage } from "../../middleware/upload.middleware.js";

const router = Router();

router.get(
  "/products/:productId/images",
  getProductImagesController
);

router.post(
  "/products/:productId/images",
  uploadProductImage.single("image"),
  uploadProductImageController
);

router.delete(
  "/products/:productId/images/:imageId",
  deleteProductImageController
);

router.patch(
  "/products/:productId/images/reorder",
  reorderProductImagesController
);

router.patch(
  "/products/:productId/images/:imageId/primary",
  setPrimaryProductImageController
);

export default router;