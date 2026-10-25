// Figma W-3c 숨기기 확인. 딤은 드로어와 같다
export default function HideDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="bg-fg/14 fixed inset-0 z-10 backdrop-blur-[0.1875rem]" />
      <div
        role="dialog"
        aria-label={title}
        className="fixed top-1/2 left-1/2 z-20 isolate w-100 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="glass flex flex-col items-center gap-2.5 rounded-xl p-7 [--glass-from:1] [--glass-to:1]">
          <h2 className="text-title-lg">{title}</h2>
          <p className="text-body text-fg-secondary text-center whitespace-pre-line">
            {message}
          </p>
          <div className="flex w-full items-start gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="text-body border-line flex-1 cursor-pointer rounded-full border bg-linear-to-br from-white/19 to-white/13 px-4.5 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-danger text-body flex-1 cursor-pointer rounded-full px-4.5 py-2.5 text-white"
            >
              숨기기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
