// Figma W-3 search. 검색어가 있으면 초록 테두리(1.5px)와 지우기가 나온다
export default function SpeciesSearch({ value }: { value?: string }) {
  return (
    <div
      className={`text-body flex w-60 shrink-0 items-center gap-2 rounded-full bg-linear-to-br from-white/94 to-white/64 px-3.5 py-2.25 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem] ${value ? "border-primary border-[0.09375rem]" : "border border-white"}`}
    >
      <p className={`flex-1 ${value ? "" : "text-fg-tertiary"}`}>
        {value ?? "종 이름 검색"}
      </p>
      {value && <span className="text-label text-primary">지우기</span>}
    </div>
  );
}
