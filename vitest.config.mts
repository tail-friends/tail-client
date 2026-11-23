import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // 토큰 코드가 localStorage·location을 써서 브라우저 환경(jsdom)에서 돌린다
  test: { environment: "jsdom" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
