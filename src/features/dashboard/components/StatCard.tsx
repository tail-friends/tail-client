// Figma Admin/StatCard
export default function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="glass flex flex-1 flex-col gap-1.5 rounded-xl px-5.5 py-5">
      <p className="text-label text-fg-secondary">{label}</p>
      <p className="text-number-lg">{value}</p>
      <p className="text-caption text-success min-h-3.5">{note}</p>
    </div>
  );
}
