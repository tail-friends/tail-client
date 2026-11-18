# 운영 배포 (CD)

`main`에 push되면 CI가 Lint·Typecheck·Build를 통과한 뒤 Docker 이미지(`ghcr.io/tail-friends/tail-client:sha-<커밋 7자리>`)를 GHCR에 올린다.
CI가 성공하면 `.github/workflows/deploy.yml`이 그 이미지를 운영 서버에 띄운다.

웹은 서버(tail-server)와 **같은 운영 서버**에 컨테이너로 뜬다. 서버는 `/opt/tail-server`, 웹은 `/opt/tail-client`를 쓴다.

## 배포가 하는 일

1. `docker-compose.prod.yml`과 `deploy-remote.sh`를 서버의 `/opt/tail-client`로 올린다.
2. 서버에서 GHCR 로그인 → `docker compose pull web` → `.env`에 `IMAGE_TAG` 기록 → `up -d` → `http://localhost:3001/login`을 최대 1분 확인한다.
3. 실패하면 `/opt/tail-client/current_tag`에 적힌 이전 태그로 되돌리고, 이번 배포는 실패로 끝낸다.

## API 주소는 빌드할 때 들어간다

`NEXT_PUBLIC_API_URL`은 `next build` 때 코드에 박힌다. 서버에서 환경 변수를 바꿔도 반영되지 않는다.
주소를 바꾸면 저장소 변수를 고친 뒤 `main`에 다시 반영하거나 CI를 다시 돌려 이미지를 새로 만든다.

## 1. 서버 준비 (처음 한 번)

tail-server 배포 때 만든 `deploy` 사용자와 Docker를 그대로 쓴다.

```bash
sudo mkdir -p /opt/tail-client
sudo chown deploy:deploy /opt/tail-client
```

방화벽에서 3001 포트를 연다. (서버의 3000은 tail-server의 그라파나가 127.0.0.1에서 쓰고 있어 웹은 3001로 연다.)

웹의 origin을 서버의 CORS에 추가한다. `/opt/tail-server/.env`의 `CORS_ALLOWED_ORIGINS`에 `http://<서버 주소>:3001`을 쉼표로 이어 넣고 서버를 다시 띄운다.

```bash
sudo -u deploy nano /opt/tail-server/.env    # CORS_ALLOWED_ORIGINS=기존값,http://<서버 주소>:3001
cd /opt/tail-server && sudo -u deploy env IMAGE_TAG="$(cat current_tag)" docker compose up -d app
```

## 2. GitHub 설정 (처음 한 번)

### 저장소 변수

Settings → Secrets and variables → Actions → **Variables** → New repository variable

| 이름                  | 값                                                       |
| --------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | 운영 서버 API 주소. 예: `http://<서버 주소>:8080/api/v1` |

### prod environment

Settings → Environments → **New environment** → 이름 `prod`.
(권장) Deployment protection rules에서 `main` 브랜치만 허용한다.

`prod`의 **Secrets**에 tail-server와 같은 값을 등록한다.

| 이름              | 값                                       |
| ----------------- | ---------------------------------------- |
| `SSH_HOST`        | 서버 주소                                |
| `SSH_PORT`        | SSH 포트 (보통 22)                       |
| `SSH_USER`        | `deploy`                                 |
| `SSH_PRIVATE_KEY` | 배포용 개인 키 전체 (BEGIN/END 줄 포함)  |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -p <포트> <서버 주소>` 결과 |

GHCR 로그인은 워크플로의 `GITHUB_TOKEN`으로 하므로 따로 등록할 것이 없다.

## 3. 첫 배포

1. `develop`을 `main`으로 PR해서 머지한다. CI가 성공하면 Deploy가 자동으로 시작된다.
2. 로그에 `OK: sha-xxxxxxx 배포 완료`가 나오면 `http://<서버 주소>:3001`에서 확인한다.

첫 배포는 `current_tag`가 없어서 실패해도 롤백할 이전 버전이 없다.

## 4. 확인·롤백

```bash
ssh deploy@<서버 주소>      # 다른 계정이면 아래 명령 앞에 sudo -u deploy
cd /opt/tail-client
cat current_tag
docker compose ps
docker compose logs --tail 100 web
```

`docker compose`는 배포 스크립트가 `.env`에 적어 둔 `IMAGE_TAG`를 쓴다. `.env`는 직접 고치지 않고, 다른 버전은 Deploy로 띄운다.

이전 버전으로 되돌리기: Actions → Deploy → Run workflow → `image_tag`에 이전 태그(예: `sha-1a2b3c4`).

## 문제 해결

| 증상                                      | 확인할 것                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| CI `Check API URL variable` 실패          | 저장소 변수 `NEXT_PUBLIC_API_URL`                                               |
| `scp: /opt/tail-client/...: No such file` | 서버에 `/opt/tail-client` 폴더와 소유자                                         |
| `pull access denied`                      | Packages → tail-client → Package settings에서 이 저장소의 Actions 읽기 권한     |
| 화면은 뜨는데 API 호출이 CORS 에러        | 서버 `.env`의 `CORS_ALLOWED_ORIGINS`에 웹 origin이 있는지                       |
| 화면은 뜨는데 API가 엉뚱한 주소로 감      | 이미지를 빌드할 때의 `NEXT_PUBLIC_API_URL`. 바꾼 뒤 이미지를 다시 만들어야 한다 |
