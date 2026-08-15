"use client";

import { useState } from "react";
import Script from "next/script";
import { KAKAO_JS_KEY } from "@/lib/config/client";

declare global {
  interface Window {
    Kakao: {
      init: (jsKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: {
          objectType: "feed";
          content: KakaoFeedShareContent;
        }) => void;
        uploadImage: (options: {
          file: File[];
        }) => Promise<{ infos: { original: { url: string } } }>;
      };
    };
  }
}

export type KakaoFeedShareContent = {
  title: string;
  description: string;
  imageUrl: string;
  link: { mobileWebUrl: string; webUrl: string };
};

export function useKakaoShare() {
  const [isReady, setIsReady] = useState(false);

  const kakaoScript = (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      strategy="afterInteractive"
      onReady={() => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }

        setIsReady(true);
      }}
    />
  );

  async function uploadImage(file: File) {
    const { infos } = await window.Kakao.Share.uploadImage({ file: [file] });

    return infos.original.url;
  }

  function shareFeed(content: KakaoFeedShareContent) {
    window.Kakao.Share.sendDefault({ objectType: "feed", content });
  }

  return { isReady, kakaoScript, uploadImage, shareFeed };
}
