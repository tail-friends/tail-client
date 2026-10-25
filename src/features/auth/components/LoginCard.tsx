import Brand from "@/components/Brand";

// Figma login-card: 로고 아래로 화면별 내용이 들어간다
export default function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass flex w-105 max-w-full flex-col items-center gap-3.5 rounded-xl px-8 py-9">
      <Brand size="lg" />
      {children}
    </div>
  );
}
