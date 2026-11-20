import { api, loginHref, tokens } from "@/lib/api";

export type Me = { id: number; nickname: string; role: "KEEPER" | "ADMIN" };

// 웹에서 연결하는 소셜 로그인. 애플은 서버가 iOS 앱 로그인만 받아 아직 없다
const authorizeUrls = {
  kakao: "https://kauth.kakao.com/oauth/authorize",
  google: "https://accounts.google.com/o/oauth2/v2/auth",
};

export type Provider = keyof typeof authorizeUrls;

export const canLogin = (provider: string): provider is Provider =>
  provider in authorizeUrls;

const clientIds: Record<Provider, string | undefined> = {
  kakao: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
  google: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};

// 소셜 서비스는 인가 코드를 /login?code=...&state=... 로 돌려준다
const redirectUri = () => `${location.origin}/login`;

// state = "<provider>.<난수>". 돌아왔을 때 저장한 값과 같은지 비교해 다른 사이트가 보낸 코드를 막는다
const STATE_KEY = "oauthState";

function makeState(provider: Provider) {
  // crypto.randomUUID는 https에서만 있어 getRandomValues로 만든다
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const state = `${provider}.${nonce}`;
  sessionStorage.setItem(STATE_KEY, state);
  return state;
}

// 저장한 state와 같으면 그 provider, 다르면 null
function readState(state: string) {
  const saved = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return saved && saved === state ? (state.split(".")[0] as Provider) : null;
}

export function startLogin(provider: Provider) {
  const clientId = clientIds[provider];
  if (!clientId) {
    location.assign(loginHref("failed"));
    return;
  }
  const url = new URL(authorizeUrls[provider]);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: "code",
    state: makeState(provider),
  }).toString();
  if (provider === "google")
    url.searchParams.set("scope", "openid email profile");
  location.assign(url);
}

// 관리자면 true. 아니면 로그아웃하고 false. code가 없으면(사용자가 취소) 실패로 본다
export async function finishLogin(code: string | undefined, state: string) {
  const provider = readState(state);
  if (!provider || !code) throw new Error("소셜 로그인을 마치지 못했어요");

  const { data } = await api.post("/auth/oauth/callback", {
    provider: provider.toUpperCase(),
    code,
    redirectUri: redirectUri(),
  });
  tokens.save(data.data);

  let me: Me;
  try {
    me = await getMe();
  } catch (error) {
    // 역할을 모르는 채로 토큰을 남기면 관리자가 아니어도 들어올 수 있다
    await logout();
    throw error;
  }
  if (me.role === "ADMIN") return true;
  await logout();
  return false;
}

export async function getMe() {
  const { data } = await api.get<{ data: Me }>("/auth/me");
  return data.data;
}

// 서버 폐기에 실패해도 이 브라우저에서는 로그아웃한다
export async function logout() {
  await api
    .post("/auth/logout", { refreshToken: tokens.refresh })
    .catch(() => {});
  tokens.clear();
}
