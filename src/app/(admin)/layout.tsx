// 로그인 후 화면 공통 레이아웃 (사이드바, ADMIN 권한 확인 자리)
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return <div className="flex flex-1">{children}</div>;
}
