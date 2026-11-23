import type { Stats } from "../api";

// Figma species · 종별 등록 개체 수. 막대 길이는 가장 많은 종 대비 비율
export default function SpeciesCountPanel({
  counts,
}: {
  counts: Stats["speciesCounts"];
}) {
  const max = Math.max(1, ...counts.map(({ count }) => count));

  return (
    <section className="glass flex w-90 shrink-0 flex-col rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-5.25 py-4.75">
      <h2 className="text-title-md mb-2.5">종별 등록 개체 수</h2>
      {counts.length === 0 && (
        <p className="text-body text-fg-tertiary py-1.75">
          등록된 개체가 없어요
        </p>
      )}
      {counts.map(({ name, count }) => (
        <div key={name} className="flex flex-col gap-1.25 py-1.75">
          <div className="text-body flex">
            <p className="flex-1">{name}</p>
            <p className="text-fg-secondary">{count}마리</p>
          </div>
          <div className="bg-sunken h-1.5 overflow-clip rounded-[0.1875rem]">
            <div
              className="bg-forest-500 h-full rounded-[0.1875rem]"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
