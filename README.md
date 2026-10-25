# tail-client

꼬리친구 관리자 웹 (Next.js + TypeScript + Tailwind CSS).

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
```

## 스크립트

| 명령                | 설명                                      |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | 개발 서버                                 |
| `npm run build`     | 프로덕션 빌드                             |
| `npm run lint`      | ESLint                                    |
| `npm run format`    | Prettier로 포맷 (`format:check`는 검사만) |
| `npm run typecheck` | 라우트 타입 생성 + `tsc`                  |

## 환경 변수

`npm run dev`는 `.env.development`의 값을 자동으로 씁니다. 다른 주소를 쓰려면 `.env.local`에 같은 이름으로 덮어씁니다. 배포 환경에서는 직접 설정해야 합니다.

| 이름                  | 설명                                               |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | 서버 API 주소 (예: `http://localhost:8080/api/v1`) |

서버 통신은 `src/lib/api.ts`의 axios 인스턴스와 TanStack Query(`src/app/providers.tsx`)를 사용합니다.

## 폴더 구조

```
src/
  app/            # 라우트. 페이지는 얇게 두고 로직은 features로
  features/       # 도메인별 코드
    <도메인>/
      api.ts      # axios 요청 함수
      queries.ts  # TanStack Query 훅
      components/ # 이 도메인에서만 쓰는 컴포넌트
  components/     # 여러 도메인이 같이 쓰는 UI
  lib/            # 공용 설정 (api.ts: axios 인스턴스)
```

- 한 도메인에서만 쓰면 `features/<도메인>`, 두 곳 이상에서 쓰면 `components/`로 옮깁니다.
- 페이지 경로는 디자인이 나오면 잡습니다.

## 반응형

- 노트북·데스크톱 전용입니다. Figma 1440 화면을 기준으로 화면 폭에 비례해 전체 크기가 바뀝니다 (`html` 글자 크기 = 화면 폭 ÷ 90).
- 그래서 크기는 px 대신 rem 기반으로 씁니다. Tailwind 간격(`p-4`, `w-105` 등)이나 `[1.125rem]`처럼 쓰고, `[18px]`처럼 px로 쓰지 않습니다. 1px 테두리만 예외입니다.
- 1280보다 좁으면 1280 크기로 고정되고 가로 스크롤이 생깁니다.

## 작업 흐름

- 브랜치 전략: `feature/*` → `develop` → `main`. 작업 브랜치는 `develop`으로 PR, 배포할 때 `develop`을 `main`으로 PR.
- `develop`·`main`에 직접 푸시 금지. PR → CI 통과 시 승인 없이 머지.
- CI: `.github/workflows/ci.yml`. `Lint`(ESLint·Prettier), `Typecheck`, `Build` 세 작업이 동시에 돌고 모두 필수 체크입니다.
- `develop`·`main`이 갱신되면 열린 PR 브랜치를 자동으로 업데이트하고 CI를 다시 돌립니다.
