import { apiClient } from "@/lib/api/client";
import type {
  ReceiptResponse,
  ReceiptDetailResponse,
  ReceiptDownloadUrlResponse,
  ReceiptUpdateRequest,
} from "./types";

export async function getReceipts(savedCourseId: number) {
  return apiClient.get<ReceiptResponse>(`/api/saved-courses/${savedCourseId}/receipts`);
}

export async function getReceiptsDetail(savedCourseId: number, receiptId: number) {
  return apiClient.get<ReceiptDetailResponse>(
    `/api/saved-courses/${savedCourseId}/receipts/${receiptId}`,
  );
}

export async function deleteReceipt(savedCourseId: number, receiptId: number) {
  return apiClient.delete<null>(`/api/saved-courses/${savedCourseId}/receipts/${receiptId}`);
}

export async function getReceiptDownloadUrl(savedCourseId: number, receiptId: number) {
  return apiClient.get<ReceiptDownloadUrlResponse>(
    `/api/saved-courses/${savedCourseId}/receipts/${receiptId}/download-url`,
  );
}

export async function updateReceipt(
  savedCourseId: number,
  receiptId: number,
  body: ReceiptUpdateRequest,
) {
  return apiClient.patch<ReceiptDetailResponse, ReceiptUpdateRequest>(
    `/api/saved-courses/${savedCourseId}/receipts/${receiptId}`,
    { body },
  );
}
