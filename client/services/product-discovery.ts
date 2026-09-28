import {
  ProductDiscoveryPayload,
  ProductDiscoveryResponse,
} from "@/types/discovery";
import api from "@/lib/api";

export async function discoverProducts(
  payload: ProductDiscoveryPayload
): Promise<ProductDiscoveryResponse> {
  const response = await api.post(
    `/products/discover`,
    payload
  );

  return response.data.data;
}