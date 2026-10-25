// Figma seg/*. 하나만 고르는 알약 버튼 줄
export default function SegmentField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label text-fg-secondary">{label}</span>
      <div className="flex gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={`text-label cursor-pointer rounded-full px-3 py-1.75 ${option === value ? "bg-primary text-white" : "border-line text-fg-secondary border bg-white"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
