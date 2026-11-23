import { NextRequest } from "next/server";
import { expect, test } from "vitest";
import { config, proxy } from "./proxy";

const call = (cookie?: string) =>
  proxy(
    new NextRequest("http://admin.test/species", {
      headers: cookie ? { cookie } : {},
    }),
  );

test("로그인 표시 쿠키가 없으면 로그인으로 보낸다", () => {
  const res = call();
  expect(res.headers.get("location")).toBe("http://admin.test/login");
});

test("로그인 표시 쿠키가 있으면 통과시킨다", () => {
  expect(call("signedIn=1").headers.get("location")).toBeNull();
});

test("로그인·정적 파일은 보호하지 않고 나머지 페이지는 보호한다", () => {
  const re = new RegExp(`^${config.matcher[0]}$`);
  for (const path of ["/", "/species", "/guides/1", "/login-help"])
    expect(re.test(path), path).toBe(true);
  for (const path of [
    "/login",
    "/_next/static/a.js",
    "/favicon.ico",
    "/robots.txt",
  ])
    expect(re.test(path), path).toBe(false);
});
