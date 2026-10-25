// Figma Admin/TopBar. 운영자 이름은 퍼블리싱용 고정값
export default function TopBar({ title }: { title: string }) {
  return (
    <header className="glass flex h-16 shrink-0 items-center gap-3 rounded-full [--glass-angle:177deg] [--glass-from:0.188] [--glass-to:0.128] pr-3 pl-6">
      <h1 className="text-display-md flex-1">{title}</h1>
      <div className="text-body flex items-center gap-2">
        <span className="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-full">
          운
        </span>
        운영자 · ADMIN
      </div>
      <button
        type="button"
        className="text-label border border-white shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem] text-fg-secondary cursor-pointer rounded-full bg-linear-to-br from-white/94 to-white/64 px-4 py-2.25"
      >
        로그아웃
      </button>
    </header>
  );
}
