import axios, { type InternalAxiosRequestConfig } from "axios";
import { markSignedIn, markSignedOut } from "./session";

// 서버는 X-Client-Type: WEB이면 리프레시 토큰을 응답 본문 대신 httpOnly 쿠키로 주고받는다
const webRequest = {
  withCredentials: true,
  headers: { "X-Client-Type": "WEB" },
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  ...webRequest,
});

// 로그인 화면 주소. error는 login/page.tsx가 보여 주는 화면 종류
export type LoginError = "forbidden" | "failed" | "expired";
export const loginHref = (error?: LoginError) =>
  error ? `/login?error=${error}` : "/login";

// 액세스 토큰은 메모리에만 둔다. 새로고침으로 사라지면 첫 401에서 쿠키로 재발급해 복구한다.
// 리프레시 토큰은 서버가 준 httpOnly 쿠키라 JS는 보지 못한다
export const tokens = {
  access: null as string | null,
};

export function signIn(accessToken: string) {
  tokens.access = accessToken;
  markSignedIn();
}

export function signOut() {
  tokens.access = null;
  markSignedOut();
}

api.interceptors.request.use((config) => {
  if (tokens.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

// 소셜 로그인 실패(OAUTH_FAILED)도 401이라 재발급하지 않는다. 로그아웃은 인증이 필요해서,
// 액세스 토큰이 만료됐으면 서버 요구대로 재발급한 뒤 다시 보낸다
const noReissue = ["/auth/oauth/callback"];

// 동시에 401이 여러 개 나도 재발급은 한 번만 한다 (쓴 리프레시 토큰은 서버가 바꾼다)
let reissuing: Promise<void> | null = null;

api.interceptors.response.use(undefined, async (error) => {
  const config: InternalAxiosRequestConfig & { retried?: boolean } =
    error.config;
  if (
    error.response?.status !== 401 ||
    noReissue.includes(config.url ?? "") ||
    config.retried
  ) {
    throw error;
  }
  config.retried = true;
  reissuing ??= axios
    .put(`${api.defaults.baseURL}/auth/reissue`, undefined, webRequest)
    .then((res) => signIn(res.data.data.accessToken))
    .finally(() => (reissuing = null));
  try {
    await reissuing;
  } catch (reissueError) {
    // 서버·네트워크 장애는 만료가 아니므로 원래 에러를 던진다
    if (
      !axios.isAxiosError(reissueError) ||
      reissueError.response?.status !== 401
    )
      throw error;
    signOut();
    // 로그아웃은 만료 화면 없이 호출한 쪽이 마무리한다 (사용자가 직접 나간 것이고, 관리자 아님 안내를 덮지 않는다)
    if (config.url === "/auth/logout") throw error;
    return leave(loginHref("expired"));
  }
  return api(config);
});

// 다시 로그인하면 돌아올 수 있게 지금 주소를 남기고, 화면을 옮기는 동안
// 호출한 쪽이 에러 처리로 다른 곳에 보내지 않도록 끝나지 않는 Promise를 준다
function leave(href: string) {
  sessionStorage.setItem("returnTo", location.pathname + location.search);
  location.assign(href);
  return new Promise<never>(() => {});
}
