const tones = {
  success: "bg-primary-soft text-success",
  muted: "bg-sunken text-fg-secondary",
};

// Figma Chip. success는 노출, muted는 숨김
export default function Chip({
  tone = "success",
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`text-caption rounded-full px-2.5 py-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
