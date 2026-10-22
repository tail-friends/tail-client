# tail-client

꼬리친구 관리자 웹과 랜딩 페이지 (Next.js + TypeScript + Tailwind CSS).

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 라우트 타입 생성 + `tsc` |

## 환경 변수

`.env.example`을 `.env.local`로 복사해서 사용합니다.

| 이름 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | 서버 API 주소 (예: `http://localhost:8080/api/v1`) |

서버 통신은 `src/lib/api.ts`의 axios 인스턴스와 TanStack Query(`src/app/providers.tsx`)를 사용합니다.

## 작업 흐름

- `main`에 직접 푸시 금지. 브랜치 → PR → CI 통과 시 승인 없이 머지 (squash).
- CI: `.github/workflows/ci.yml` (lint, typecheck, build). 필수 체크는 `Build`.
- main이 갱신되면 열린 PR 브랜치를 자동으로 업데이트하고 CI를 다시 돌립니다.
- PR이 열리면 Discord로 알림을 보냅니다 (`DISCORD_WEBHOOK_URL` 시크릿, `DISCORD_FRONTEND_MENTIONS` 변수).
