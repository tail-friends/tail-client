#!/usr/bin/env bash
# 운영 서버에서 실행된다 (deploy.yml이 /opt/tail-client/deploy.sh 로 올려 실행).
# 환경 변수: IMAGE_TAG(배포할 태그), GHCR_USER. 표준 입력 첫 줄: GHCR 읽기 토큰.
set -uo pipefail
cd /opt/tail-client

DOCKER_CONFIG=$(mktemp -d)   # 로그인 정보를 서버에 남기지 않는다
export DOCKER_CONFIG
trap 'rm -rf "$DOCKER_CONFIG"' EXIT

read -r GHCR_TOKEN
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin || exit 1

# 최대 1분까지 로그인 화면이 열리는지 확인한다
wait_healthy() {
  for _ in $(seq 1 30); do
    if curl -fsS -o /dev/null http://localhost:3001/login 2>/dev/null; then
      return 0
    fi
    sleep 2
  done
  return 1
}

PREVIOUS_TAG=$(cat current_tag 2>/dev/null || true)

# 띄운 태그를 .env에 적어 둔다. 서버에서 IMAGE_TAG 없이 docker compose ps/logs를 바로 쓸 수 있다.
# 이 .env에는 IMAGE_TAG만 있다 (웹의 설정값은 이미지를 빌드할 때 들어간다)
set_image_tag() {
  printf '# 배포 스크립트가 적는다. 직접 고치지 않는다\nIMAGE_TAG=%s\n' "$1" > .env
}

export IMAGE_TAG
docker compose pull web || exit 1
set_image_tag "$IMAGE_TAG" || exit 1
docker compose up -d --remove-orphans

if wait_healthy; then
  echo "$IMAGE_TAG" > current_tag
  echo "OK: $IMAGE_TAG 배포 완료"
  docker image prune -f > /dev/null
  exit 0
fi

echo "FAIL: 웹이 정상 기동하지 않았습니다"
docker compose logs --tail 80 web || true

if [ -n "$PREVIOUS_TAG" ]; then
  echo "이전 버전($PREVIOUS_TAG)으로 롤백합니다"
  export IMAGE_TAG="$PREVIOUS_TAG"
  set_image_tag "$PREVIOUS_TAG"
  docker compose up -d
  if wait_healthy; then
    echo "ROLLBACK OK: 이전 버전으로 복구했습니다. 이번 배포는 실패입니다"
  else
    echo "ROLLBACK FAIL: 이전 버전도 기동하지 않습니다. 서버를 직접 확인하세요"
  fi
fi
exit 1
