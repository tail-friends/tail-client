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

## 작업 흐름

- `main`에 직접 푸시 금지. 브랜치 → PR → CI 통과 시 승인 없이 머지 (squash).
- CI: `.github/workflows/ci.yml` (lint, typecheck, build).
