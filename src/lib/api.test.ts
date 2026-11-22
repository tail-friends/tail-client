import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { requests, sent, setServer } from "@/test/fakeServer";
import { api, tokens } from "./api";

const assign = vi.fn();
const reissues = () => requests.filter((r) => r.url?.endsWith("/reissue"));
const authOf = (url: string) => sent(url).map((r) => r.headers.Authorization);

beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal("location", { assign, pathname: "/species", search: "" });
  tokens.access = "old";
});

afterEach(() => {
  vi.unstubAllGlobals();
  assign.mockClear();
});

// access 토큰이 "new"일 때만 통과하는 API
const okWithNewToken = (
  config: InternalAxiosRequestConfig,
): [number, unknown] =>
  config.headers.Authorization === "Bearer new"
    ? [200, { data: "ok" }]
    : [401, {}];

const reissueOk = (config: InternalAxiosRequestConfig): [number, unknown] =>
  config.url?.endsWith("/reissue")
    ? [200, { data: { accessToken: "new" } }]
    : okWithNewToken(config);

test("401이면 한 번 재발급하고 새 토큰으로 다시 보낸다", async () => {
  setServer(reissueOk);

  const res = await api.get("/animals");

  expect(res.data).toEqual({ data: "ok" });
  expect(authOf("/animals")).toEqual(["Bearer old", "Bearer new"]);
  expect(reissues()).toHaveLength(1);
  expect(reissues()[0].withCredentials).toBe(true);
  expect(tokens.access).toBe("new");
});

test("401이 동시에 여러 개 와도 재발급은 한 번만 한다", async () => {
  setServer(reissueOk);

  await Promise.all([api.get("/a"), api.get("/b"), api.get("/c")]);

  expect(reissues()).toHaveLength(1);
});

test("재발급이 401이면 토큰을 지우고 만료 화면으로 보내며 보던 주소를 남긴다", async () => {
  setServer(() => [401, {}]);

  void api.get("/animals");

  await vi.waitFor(() =>
    expect(assign).toHaveBeenCalledWith("/login?error=expired"),
  );
  expect(tokens.access).toBeNull();
  expect(sessionStorage.getItem("returnTo")).toBe("/species");
});

test("재발급이 서버 오류면 로그인 화면으로 보내지 않고 원래 에러를 던진다", async () => {
  setServer((config) =>
    config.url?.endsWith("/reissue") ? [500, {}] : [401, {}],
  );

  await expect(api.get("/animals")).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(assign).not.toHaveBeenCalled();
});

test("소셜 로그인의 401은 재발급하지 않는다", async () => {
  setServer(() => [401, {}]);

  await expect(api.post("/auth/oauth/callback")).rejects.toBeInstanceOf(
    AxiosError,
  );
  expect(reissues()).toHaveLength(0);
});

test("액세스 토큰이 만료돼 로그아웃이 401이면 재발급한 뒤 다시 보낸다", async () => {
  setServer((config) =>
    config.url === "/auth/logout" &&
    config.headers.Authorization === "Bearer new"
      ? [204, null]
      : reissueOk(config),
  );

  await api.post("/auth/logout");

  expect(authOf("/auth/logout")).toEqual(["Bearer old", "Bearer new"]);
});

test("새로고침해 액세스 토큰이 없어도 첫 401에서 쿠키로 재발급해 복구한다", async () => {
  tokens.access = null;
  setServer(reissueOk);

  const res = await api.get("/animals");

  expect(res.data).toEqual({ data: "ok" });
  expect(authOf("/animals")).toEqual([undefined, "Bearer new"]);
});

test("모든 요청과 재발급에 웹 표시 헤더와 쿠키 전송을 붙인다", async () => {
  setServer(reissueOk);

  await api.get("/animals");

  for (const r of requests) {
    expect(r.withCredentials).toBe(true);
    expect(r.headers["X-Client-Type"]).toBe("WEB");
  }
  expect(reissues()).toHaveLength(1);
});

test("로그인 표시 쿠키는 재발급 성공 때 남고 만료되면 지운다", async () => {
  setServer(reissueOk);
  await api.get("/animals");
  expect(document.cookie).toContain("signedIn=1");

  setServer(() => [401, {}]);
  tokens.access = null;
  void api.get("/animals");
  await vi.waitFor(() => expect(assign).toHaveBeenCalled());
  expect(document.cookie).not.toContain("signedIn");
});
