import type { ComponentProps } from "react";

// Figma Admin/Input. error가 있으면 빨간 테두리와 안내문
export default function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & ComponentProps<"input">) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-label text-fg-secondary">{label}</span>
      <input
        {...props}
        className={`text-body placeholder:text-fg-tertiary rounded-md border bg-white px-3.5 py-2.5 outline-none ${error ? "border-danger" : "border-line"}`}
      />
      {error && <span className="text-caption text-[#b23b30]">{error}</span>}
    </label>
  );
}
