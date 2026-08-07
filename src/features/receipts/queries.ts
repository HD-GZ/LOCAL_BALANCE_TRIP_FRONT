import { useRouter } from "next/navigation";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteReceipt,
  getReceiptDownloadUrl,
  getReceipts,
  getReceiptsDetail,
  updateReceipt,
} from "@/features/receipts/api";
import type { ReceiptUpdateRequest } from "@/features/receipts/types";

export const receiptsQueryKeys = {
  all: ["receipts"] as const,
  receipts: (savedCourseId: number) => [...receiptsQueryKeys.all, savedCourseId] as const,
  receiptsDetail: (savedCourseId: number, receiptId: number) =>
    [...receiptsQueryKeys.all, savedCourseId, receiptId] as const,
};

export const receiptsQueries = {
  receipts: (savedCourseId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: receiptsQueryKeys.receipts(savedCourseId),
      queryFn: () => getReceipts(savedCourseId),
    }),
  receiptsDetail: (savedCourseId: number, receiptId: number, enabled = true) =>
    queryOptions({
      enabled,
      queryKey: receiptsQueryKeys.receiptsDetail(savedCourseId, receiptId),
      queryFn: () => getReceiptsDetail(savedCourseId, receiptId),
    }),
};

export function useDeleteReceiptMutation(savedCourseId: number, receiptId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteReceipt(savedCourseId, receiptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receiptsQueryKeys.receipts(savedCourseId) });
      router.push(`/saved-courses/${savedCourseId}/receipts`);
    },
  });
}

export function useReceiptDownloadUrlMutation(savedCourseId: number, receiptId: number) {
  return useMutation({
    mutationFn: () => getReceiptDownloadUrl(savedCourseId, receiptId),
    onSuccess: (data) => {
      window.location.href = data.downloadUrl;
    },
  });
}

export function useUpdateReceiptMutation(savedCourseId: number, receiptId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ReceiptUpdateRequest) => updateReceipt(savedCourseId, receiptId, body),
    onSuccess: (data) => {
      queryClient.setQueryData(receiptsQueryKeys.receiptsDetail(savedCourseId, receiptId), data);
      queryClient.invalidateQueries({ queryKey: receiptsQueryKeys.receipts(savedCourseId) });
    },
  });
}
