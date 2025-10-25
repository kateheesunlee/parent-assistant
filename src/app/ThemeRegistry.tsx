"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

function createEmotionCache() {
  const cache = createCache({ key: "mui", prepend: true });
  // compat mode: helps stabilize server/client hash mismatch
  (cache as unknown as { compat: boolean }).compat = true;
  return cache;
}

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() => createEmotionCache());

  useServerInsertedHTML(() => {
    // 서버에서 생성된 스타일을 head에 주입
    const { key, inserted } = cache;
    const names = Object.keys(inserted);
    if (names.length === 0) return null;
    return (
      <style
        data-emotion={`${key} ${names.join(" ")}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: names.map((name) => inserted[name]).join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
