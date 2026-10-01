import { Router } from "express";

import {
  createProductController,
  deleteProductController,
  getActiveCategoriesController,
  getProductController,
  getProductsController,
  getRelatedProductsController,
  updateProductController,
} from "./product.controller.js";

import {
  deleteProductImageController,
  getProductImagesController,
  reorderProductImagesController,
  setPrimaryProductImageController,
  uploadProductImageController,
} from "../product-image/product-image.controller.js";

import { uploadProductImage } from "../../middleware/upload.middleware.js";

const router = Router();


//  ========== Product ==========
router.post(
  "/",
  createProductController
);

router.get(
  "/",
  getProductsController
);

router.get(
  "/categories",
  getActiveCategoriesController
);

router.get(
  "/:id/related",
  getRelatedProductsController,
);

router.get(
  "/:id",
  getProductController
);

router.patch(
  "/:id",
  updateProductController
);

router.delete(
  "/:id",
  deleteProductController
);


// =========== Product Images ===========
router.get(
  "/:productId/images",
  getProductImagesController
);

router.post(
  "/:productId/images",
  uploadProductImage.single("image"),
  uploadProductImageController
);

router.delete(
  "/:productId/images/:imageId",
  deleteProductImageController
);

router.patch(
  "/:productId/images/reorder",
  reorderProductImagesController
);

router.patch(
  "/:productId/images/:imageId/primary",
  setPrimaryProductImageController
);

export default router;