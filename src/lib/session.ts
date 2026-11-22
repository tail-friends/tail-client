// 서버의 리프레시 쿠키(refresh_token)는 Path=/api/v1/auth라 페이지 요청에는 오지 않아 proxy가 읽지 못한다.
// 그래서 로그인했다는 표시를 따로 남겨 proxy가 페이지를 그리기 전에 /login으로 보낸다.
// 화면 이동용 힌트일 뿐이고 진짜 인증은 API가 한다. 만료됐으면 첫 API 401에서 재발급 실패로 정리된다
export const SESSION_COOKIE = "signedIn";

// shortcut: 서버 리프레시 토큰 만료(JWT_REFRESH_TOKEN_EXPIRATION 기본 14d)를 따로 적어 둔다. 서버 값을 바꾸면 같이 바꾼다
const MAX_AGE = 60 * 60 * 24 * 14;

export const markSignedIn = () => {
  document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
};

export const markSignedOut = () => {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};
