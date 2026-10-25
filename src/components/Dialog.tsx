// Figma Admin/Dialog. 화면을 어둡게 덮고 가운데에 확인창을 띄운다. 버튼은 children으로 받는다
export default function Dialog({
  title,
  message,
  children,
}: {
  title: string;
  message: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-fg/14 backdrop-blur-[0.1875rem]">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass flex w-100 flex-col items-center gap-2.5 rounded-xl [--glass-from:1] [--glass-to:1] p-7"
      >
        <h2 className="text-title-lg">{title}</h2>
        <p className="text-body text-fg-secondary text-center">{message}</p>
        <div className="flex w-full gap-2.5 *:flex-1">{children}</div>
      </div>
    </div>
  );
}
