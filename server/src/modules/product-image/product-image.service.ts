import { prisma } from "../../lib/prisma.js";
import {
  deleteCloudinaryImage,
  uploadProductImage,
} from "../../utils/cloudinary.js";

export async function createProductImage(
  productId: string,
  file: Express.Multer.File,
  altText?: string
) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  const existingImageCount =
    await prisma.productImage.count({
      where: {
        productId,
      },
    });

  const cloudinaryImage =
    await uploadProductImage(file.buffer);

  const isFirstImage =
    existingImageCount === 0;

  try {
    return await prisma.productImage.create({
      data: {
        productId,

        url: cloudinaryImage.secure_url,

        public_id: cloudinaryImage.public_id,

        altText: altText?.trim() || null,

        isPrimary: isFirstImage,

        sortOrder: existingImageCount,
      },
    });
  } catch (error) {
    // Database failed after Cloudinary succeeded.
    // Remove the orphaned Cloudinary image.
    await deleteCloudinaryImage(
      cloudinaryImage.public_id
    );

    throw error;
  }
}


export async function deleteProductImage(
  productId: string,
  imageId: string
) {
  const image =
    await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

  if (!image) {
    throw new Error("Product image not found.");
  }

  // Remove the Cloudinary asset first.
  await deleteCloudinaryImage(
    image.public_id
  );

  await prisma.$transaction(async (tx) => {
    await tx.productImage.delete({
      where: {
        id: image.id,
      },
    });

    // If the deleted image was primary,
    // promote the first remaining image.
    if (image.isPrimary) {
      const nextImage =
        await tx.productImage.findFirst({
          where: {
            productId,
          },
          orderBy: {
            sortOrder: "asc",
          },
        });

      if (nextImage) {
        await tx.productImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    }
  });

  return {
    message: "Product image deleted successfully.",
  };
}



export async function setPrimaryProductImage(
  productId: string,
  imageId: string
) {
  const image =
    await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

  if (!image) {
    throw new Error("Product image not found.");
  }

  if (image.isPrimary) {
    return image;
  }

  return prisma.$transaction(async (tx) => {
    await tx.productImage.updateMany({
      where: {
        productId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    return tx.productImage.update({
      where: {
        id: imageId,
      },
      data: {
        isPrimary: true,
      },
    });
  });
}



export async function reorderProductImages(
  productId: string,
  imageIds: string[]
) {
  const images =
    await prisma.productImage.findMany({
      where: {
        productId,
      },

      select: {
        id: true,
      },
    });

  const existingIds = new Set(
    images.map((image) => image.id)
  );

  const requestedIds = new Set(imageIds);

  if (
    existingIds.size !== requestedIds.size ||
    imageIds.some(
      (imageId) => !existingIds.has(imageId)
    )
  ) {
    throw new Error(
      "The image list does not match the product images."
    );
  }

  await prisma.$transaction(
    imageIds.map((imageId, index) =>
      prisma.productImage.update({
        where: {
          id: imageId,
        },

        data: {
          sortOrder: index,
        },
      })
    )
  );

  return prisma.productImage.findMany({
    where: {
      productId,
    },

    orderBy: {
      sortOrder: "asc",
    },
  });
}


export async function getProductImages(
  productId: string
) {
  const product =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },

      select: {
        id: true,
      },
    });

  if (!product) {
    throw new Error("Product not found.");
  }

  return prisma.productImage.findMany({
    where: {
      productId,
    },

    orderBy: {
      sortOrder: "asc",
    },
  });
}