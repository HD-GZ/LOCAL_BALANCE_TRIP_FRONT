const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

if (!naverMapClientId) {
  throw new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is required.");
}

export const NAVER_MAP_CLIENT_ID = naverMapClientId;

const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

if (!kakaoJsKey) {
  throw new Error("NEXT_PUBLIC_KAKAO_JS_KEY is required.");
}

export const KAKAO_JS_KEY = kakaoJsKey;
