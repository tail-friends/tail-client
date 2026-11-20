import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { requests, sent, setServer } from "@/test/fakeServer";
import { api, tokens } from "./api";

const assign = vi.fn();
const reissues = () => requests.filter((r) => r.url?.endsWith("/reissue"));
const authOf = (url: string) => sent(url).map((r) => r.headers.Authorization);

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal("location", { assign, pathname: "/species", search: "" });
  tokens.save({ accessToken: "old", refreshToken: "r1" });
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
    ? [200, { data: { accessToken: "new", refreshToken: "r2" } }]
    : okWithNewToken(config);

test("401이면 한 번 재발급하고 새 토큰으로 다시 보낸다", async () => {
  setServer(reissueOk);

  const res = await api.get("/animals");

  expect(res.data).toEqual({ data: "ok" });
  expect(authOf("/animals")).toEqual(["Bearer old", "Bearer new"]);
  expect(reissues()).toHaveLength(1);
  expect(JSON.parse(reissues()[0].data)).toEqual({ refreshToken: "r1" });
  expect(tokens.refresh).toBe("r2");
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
  expect(tokens.refresh).toBeNull();
  expect(sessionStorage.getItem("returnTo")).toBe("/species");
});

test("재발급이 서버 오류면 토큰을 남기고 원래 에러를 던진다", async () => {
  setServer((config) =>
    config.url?.endsWith("/reissue") ? [500, {}] : [401, {}],
  );

  await expect(api.get("/animals")).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(tokens.refresh).toBe("r1");
  expect(assign).not.toHaveBeenCalled();
});

test("다른 탭이 먼저 재발급했으면 그 토큰으로 다시 보낸다", async () => {
  setServer((config) => {
    if (!config.url?.endsWith("/reissue")) return okWithNewToken(config);
    // 다른 탭이 r1을 먼저 써서 새 토큰을 저장한 상황
    tokens.save({ accessToken: "new", refreshToken: "r2" });
    return [401, {}];
  });

  const res = await api.get("/animals");

  expect(res.data).toEqual({ data: "ok" });
  expect(assign).not.toHaveBeenCalled();
});

test("소셜 로그인과 로그아웃의 401은 재발급하지 않는다", async () => {
  setServer(() => [401, {}]);

  await expect(api.post("/auth/oauth/callback")).rejects.toBeInstanceOf(
    AxiosError,
  );
  await expect(api.post("/auth/logout")).rejects.toBeInstanceOf(AxiosError);
  expect(reissues()).toHaveLength(0);
});

test("리프레시 토큰이 없으면 재발급 없이 로그인 화면으로 보낸다", async () => {
  tokens.clear();
  setServer(() => [401, {}]);

  void api.get("/animals");

  await vi.waitFor(() => expect(assign).toHaveBeenCalledWith("/login"));
  expect(reissues()).toHaveLength(0);
});
