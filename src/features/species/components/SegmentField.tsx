// Figma seg/*. 하나만 고르는 알약 버튼 줄. value가 골라진 항목
export default function SegmentField({
  label,
  options,
  value,
}: {
  label: string;
  options: readonly string[];
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label text-fg-secondary">{label}</span>
      <div className="flex items-start gap-1.5">
        {options.map((option) => (
          <span
            key={option}
            className={`text-label rounded-full px-3 py-1.75 ${option === value ? "bg-primary text-white" : "border-line text-fg-secondary border bg-white"}`}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}
