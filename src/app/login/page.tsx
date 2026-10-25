import { Suspense } from "react";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import LoginAlert from "@/features/auth/components/LoginAlert";
import LoginCard from "@/features/auth/components/LoginCard";
import SocialLoginButton from "@/features/auth/components/SocialLoginButton";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Suspense>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// ?error=forbidden(W-1a) | failed(W-1b) | expired(W-E1), 없으면 W-1
async function LoginContent({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { error } = await searchParams;

  return (
    <>
      <LoginCard>
        {error === "forbidden" || error === "expired" ? (
          <>
            {error === "forbidden" ? (
              <LoginAlert
                tone="danger"
                title="관리자만 들어올 수 있어요"
                message={
                  "이 계정에는 ADMIN 권한이 없어서 로그아웃했어요.\n권한은 운영팀에 요청해 주세요."
                }
              />
            ) : (
              <LoginAlert
                tone="warning"
                title="로그인이 만료됐어요"
                message={
                  "오래 사용하지 않아 자동으로 로그아웃했어요.\n다시 로그인하면 보던 화면으로 돌아가요."
                }
              />
            )}
            <Button className="w-full">
              {error === "forbidden" ? "다른 계정으로 로그인" : "다시 로그인"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-body text-fg-secondary">
              운영자 계정으로 로그인해 주세요
            </p>
            <div className="flex w-full flex-col gap-2.5">
              <SocialLoginButton provider="apple" />
              <SocialLoginButton provider="kakao" />
              <SocialLoginButton provider="google" />
            </div>
            <p className="text-caption text-fg-tertiary text-center">
              앱과 같은 소셜 계정을 써요 · ADMIN 권한이 있는 계정만 들어올 수
              있어요
            </p>
          </>
        )}
      </LoginCard>
      {error === "failed" && (
        <Toast>로그인하지 못했어요 · 다시 시도해 주세요</Toast>
      )}
    </>
  );
}
