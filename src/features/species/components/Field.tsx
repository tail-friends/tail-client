// Figma Admin/Input. error가 있으면 빨간 테두리와 안내문
export default function Field({
  label,
  value,
  placeholder,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-label text-fg-secondary">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`text-body placeholder:text-fg-tertiary rounded-md border bg-white px-3.5 py-2.5 outline-none ${error ? "border-danger" : "border-line focus:border-primary"}`}
      />
      {error && <span className="text-caption text-[#b23b30]">{error}</span>}
    </label>
  );
}
