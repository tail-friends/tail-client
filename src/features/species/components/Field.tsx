// Figma Admin/Input. error가 있으면 빨간 테두리와 안내문
export default function Field({
  label,
  value,
  placeholder,
  error,
}: {
  label: string;
  value?: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-label text-fg-secondary">{label}</span>
      <div
        className={`text-body rounded-md border bg-white px-3.5 py-2.5 ${error ? "border-danger" : "border-line"} ${value ? "" : "text-fg-tertiary"}`}
      >
        {value ?? placeholder}
      </div>
      {error && <span className="text-caption text-[#b23b30]">{error}</span>}
    </div>
  );
}
