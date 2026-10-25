import eulReul from "../eulReul";

// Figma W-3c 숨기기 확인. 딤은 드로어와 같다
export default function HideDialog({
  name,
  animalCount,
  onConfirm,
  onCancel,
}: {
  name: string;
  animalCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        onClick={onCancel}
        className="bg-fg/14 fixed inset-0 z-10 backdrop-blur-[0.1875rem]"
      />
      <div
        role="dialog"
        aria-label={`${name} 숨기기`}
        className="fixed top-1/2 left-1/2 z-20 isolate w-100 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="glass [--glass-from:1] [--glass-to:1] flex flex-col items-center gap-2.5 rounded-xl p-7">
          <h2 className="text-title-lg">{eulReul(name)} 숨길까요?</h2>
          <p className="text-body text-fg-secondary text-center">
            이 종을 키우는 개체
            {animalCount === undefined ? "는" : ` ${animalCount}마리는`} 그대로
            있어요.
            <br />
            앱의 새 등록 종 목록에서만 빠지고, 언제든 다시 보이게 할 수 있어요.
          </p>
          <div className="flex w-full gap-2.5 pt-1.5">
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
