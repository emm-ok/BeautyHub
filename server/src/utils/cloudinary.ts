import type { UploadApiResponse } from "cloudinary";

import cloudinary from "../config/cloudinary.js";

const productFolder = "beautyhub/products";

export function uploadProductImage(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: productFolder,
          resource_type: "image",
        },

        (error, result) => {
          if (error || !result) {
            return reject(
              error ??
                new Error(
                  "Cloudinary image upload failed."
                )
            );
          }

          resolve(result);
        }
      );

    stream.end(buffer);
  });
}



export async function deleteCloudinaryImage(
  publicId: string
) {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
    }
  );
}