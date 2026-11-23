import Button from "@/components/Button";

// Figma W-2a error
export default function StatsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="glass flex flex-1 flex-col items-center justify-center gap-3 rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-7.75 py-11.75">
      <span className="bg-danger-soft text-display-md text-danger flex size-12 items-center justify-center rounded-full">
        !
      </span>
      <h2 className="text-title-lg">통계를 불러오지 못했어요</h2>
      <p className="text-body text-fg-secondary">
        네트워크 상태를 확인하고 다시 시도해 주세요.
      </p>
      <Button type="button" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
