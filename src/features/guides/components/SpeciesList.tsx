import { guides } from "../data";

// Figma species-list. 선택한 종은 초록 배경, 작성 전인 종은 노란 글씨로 알려 준다
export default function SpeciesList({ selectedId }: { selectedId: string }) {
  return (
    <section className="glass flex w-60 shrink-0 flex-col gap-1 rounded-xl [--glass-angle:107deg] [--glass-from:0.78] [--glass-to:0.4] px-3 py-4.5">
      <h2 className="text-button mb-2.5 px-2.5">종 선택</h2>
      {guides.map(({ id, name, updatedAt }) => {
        const selected = id === selectedId;
        return (
          <div
            key={id}
            className={`flex flex-col gap-0.5 rounded-md px-3 py-2.25 ${selected ? "bg-primary text-white" : ""}`}
          >
            <span className="text-body">{name}</span>
            <span
              className={`text-caption ${selected ? "" : updatedAt ? "text-fg-tertiary" : "text-warning"}`}
            >
              {updatedAt ? `${updatedAt} 수정` : "작성 전"}
            </span>
          </div>
        );
      })}
    </section>
  );
}
