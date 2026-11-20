import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 로그인 화면 주소. error는 login/page.tsx가 보여 주는 화면 종류
export type LoginError = "forbidden" | "failed" | "expired";
export const loginHref = (error?: LoginError) =>
  error ? `/login?error=${error}` : "/login";

type Tokens = { accessToken: string; refreshToken: string };
const ACCESS = "accessToken";
const REFRESH = "refreshToken";

// shortcut: 토큰을 localStorage에 둬서 XSS에 노출되고 서버에서 로그인 여부를 볼 수 없다. 서버가 httpOnly 쿠키를 주면 옮긴다
export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS);
  },
  get refresh() {
    return localStorage.getItem(REFRESH);
  },
  save({ accessToken, refreshToken }: Tokens) {
    localStorage.setItem(ACCESS, accessToken);
    localStorage.setItem(REFRESH, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

api.interceptors.request.use((config) => {
  const token = tokens.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 소셜 로그인 실패(OAUTH_FAILED)도 401이고, 로그아웃은 실패해도 로그인 화면으로 가면 되므로 재발급하지 않는다
const noReissue = ["/auth/oauth/callback", "/auth/logout"];

// 동시에 401이 여러 개 나도 재발급은 한 번만 한다 (쓴 리프레시 토큰은 서버가 지운다)
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
  const used = tokens.refresh;
  if (!used) return leave(loginHref());

  config.retried = true;
  reissuing ??= axios
    .put(`${api.defaults.baseURL}/auth/reissue`, { refreshToken: used })
    .then((res) => tokens.save(res.data.data))
    .finally(() => (reissuing = null));
  try {
    await reissuing;
  } catch (reissueError) {
    // 다른 탭이 먼저 재발급했으면 그 토큰으로 다시 보낸다
    if (tokens.refresh && tokens.refresh !== used) return api(config);
    // 서버·네트워크 장애는 만료가 아니므로 토큰을 남긴다
    if (
      !axios.isAxiosError(reissueError) ||
      reissueError.response?.status !== 401
    )
      throw error;
    tokens.clear();
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
