import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { tokens } from "@/lib/api";
import { sent, setServer } from "@/test/fakeServer";

// 클라이언트 ID는 모듈을 불러올 때 읽으므로 먼저 넣는다. 구글은 비워 둔다
vi.stubEnv("NEXT_PUBLIC_KAKAO_CLIENT_ID", "kakao-id");
vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "");
const { finishLogin, startLogin } = await import("./api");

const assign = vi.fn();
const ORIGIN = "http://admin.test";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal("location", {
    assign,
    origin: ORIGIN,
    pathname: "/login",
    search: "",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  assign.mockClear();
});

// 소셜 로그인 → 내 정보 → 로그아웃을 흉내 내는 서버
function serverWithRole(role: "ADMIN" | "KEEPER" | "ME_FAILS") {
  setServer((config) => {
    if (config.url === "/auth/oauth/callback")
      return [200, { data: { accessToken: "a1", refreshToken: "r1" } }];
    if (config.url === "/auth/me")
      return role === "ME_FAILS"
        ? [500, {}]
        : [200, { data: { id: 1, nickname: "운영자", role } }];
    if (config.url === "/auth/logout") return [204, null];
    return [404, {}];
  });
}

// startLogin이 만든 state를 꺼낸다 (소셜 서비스가 그대로 돌려준다)
function startKakao() {
  startLogin("kakao");
  return new URL(String(assign.mock.calls[0][0])).searchParams;
}

test("카카오 인가 화면으로 보내고 state를 남긴다", () => {
  const params = startKakao();

  expect(params.get("client_id")).toBe("kakao-id");
  expect(params.get("redirect_uri")).toBe(`${ORIGIN}/login`);
  expect(params.get("response_type")).toBe("code");
  expect(params.get("state")).toMatch(/^kakao\.[0-9a-f]{32}$/);
  expect(sessionStorage.getItem("oauthState")).toBe(params.get("state"));
});

test("클라이언트 ID가 없으면 로그인 실패 화면으로 보낸다", () => {
  startLogin("google");

  expect(assign).toHaveBeenCalledWith("/login?error=failed");
});

test("ADMIN이면 토큰을 남기고 true", async () => {
  serverWithRole("ADMIN");
  const state = startKakao().get("state")!;

  await expect(finishLogin("code-1", state)).resolves.toBe(true);

  expect(JSON.parse(sent("/auth/oauth/callback")[0].data)).toEqual({
    provider: "KAKAO",
    code: "code-1",
    redirectUri: `${ORIGIN}/login`,
  });
  expect(tokens.access).toBe("a1");
});

test("ADMIN이 아니면 로그아웃하고 false", async () => {
  serverWithRole("KEEPER");
  const state = startKakao().get("state")!;

  await expect(finishLogin("code-1", state)).resolves.toBe(false);

  expect(sent("/auth/logout")).toHaveLength(1);
  expect(tokens.access).toBeNull();
});

test("내 정보를 못 불러오면 토큰을 지우고 실패한다", async () => {
  serverWithRole("ME_FAILS");
  const state = startKakao().get("state")!;

  await expect(finishLogin("code-1", state)).rejects.toThrow();

  expect(tokens.access).toBeNull();
  expect(tokens.refresh).toBeNull();
});

test("state가 다르면 서버에 보내지 않고 실패한다", async () => {
  serverWithRole("ADMIN");
  startKakao();

  await expect(finishLogin("code-1", "kakao.forged")).rejects.toThrow();

  expect(sent("/auth/oauth/callback")).toHaveLength(0);
});

test("소셜 화면에서 취소해 code가 없으면 실패한다", async () => {
  serverWithRole("ADMIN");
  const state = startKakao().get("state")!;

  await expect(finishLogin(undefined, state)).rejects.toThrow();

  expect(sent("/auth/oauth/callback")).toHaveLength(0);
});

test("같은 state로 두 번 마칠 수 없다", async () => {
  serverWithRole("ADMIN");
  const state = startKakao().get("state")!;
  await finishLogin("code-1", state);

  await expect(finishLogin("code-1", state)).rejects.toThrow();
});
