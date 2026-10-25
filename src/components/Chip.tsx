const toneClass = {
  success: "bg-primary-soft text-success",
  warning: "bg-warning-soft text-warning",
  neutral: "bg-sunken text-fg-secondary",
};

// Figma Admin/Chip · Success, Warning, Neutral
export default function Chip({
  tone,
  children,
}: {
  tone: keyof typeof toneClass;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`text-caption rounded-full px-2.5 py-1 ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
