// Figma Admin/TopBar. 운영자 이름은 퍼블리싱용 고정값
export default function TopBar({ title }: { title: string }) {
  return (
    <header className="glass flex h-16 shrink-0 items-center gap-3 rounded-full bg-linear-177 from-white/19 to-white/13 pr-3 pl-6">
      <h1 className="text-display-md flex-1">{title}</h1>
      <div className="text-body flex items-center gap-2">
        <span className="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-full">
          운
        </span>
        운영자 · ADMIN
      </div>
      <button
        type="button"
        className="glass text-label text-fg-secondary cursor-pointer rounded-full bg-linear-154 from-white/94 to-white/64 px-4 py-[9px]"
      >
        로그아웃
      </button>
    </header>
  );
}
