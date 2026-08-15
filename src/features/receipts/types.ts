export type Receipt = {
  receiptId: number;
  merchantName: string;
  amount: number;
  paidDate: string;
};

export type ReceiptResponse = {
  totalAmount: number;
  receipts: Receipt[];
};

export type ReceiptDetailResponse = {
  receiptId: number;
  merchantName: string;
  amount: number;
  paidDate: string;
  imageUrl: string | null;
};

export type ReceiptDownloadUrlResponse = {
  downloadUrl: string;
  expiresAt: string;
};

export type ReceiptUpdateRequest = {
  merchantName: string;
  amount: number;
  paidDate: string;
};
