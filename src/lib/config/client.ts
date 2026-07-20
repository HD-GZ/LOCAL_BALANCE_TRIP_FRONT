const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

if (!naverMapClientId) {
  throw new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is required.");
}

export const NAVER_MAP_CLIENT_ID = naverMapClientId;
