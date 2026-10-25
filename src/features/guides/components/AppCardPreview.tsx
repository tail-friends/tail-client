import { sections, type Content } from "../data";

// Figma preview. 앱에서 보일 카드를 미리 보여 준다. 비어 있는 칸은 안내 문구로 채운다
export default function AppCardPreview({
  name,
  content,
}: {
  name: string;
  content: Content;
}) {
  return (
    <aside className="flex w-80 shrink-0 flex-col gap-2.5">
      <h2 className="text-button">앱 카드 미리보기</h2>
      <div className="glass flex flex-col gap-3 rounded-xl [--glass-from:0.78] [--glass-to:0.4] p-4.5">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-body flex size-9 items-center justify-center rounded-full text-white">
            {name[0]}
          </span>
          <div className="flex flex-col gap-px">
            <p className="text-title-lg">{name}</p>
            <p className="text-caption text-fg-tertiary">사육 가이드</p>
          </div>
        </div>
        {sections.map((section) => (
          <div
            key={section}
            className="flex flex-col gap-1 rounded-md bg-white px-3 py-2.5"
          >
            <p className="text-label text-primary">{section}</p>
            <p
              className={`text-caption ${content[section] ? "text-fg-secondary" : "text-fg-tertiary"}`}
            >
              {content[section] || "작성하면 여기에 보여요"}
            </p>
          </div>
        ))}
      </div>
      <p className="text-caption bg-warning-soft text-warning rounded-md px-3 py-2.5">
        앱에 보이는 건 3차 업데이트(사육 가이드 화면)부터예요. 내용은 1차부터
        미리 쌓아 둬요.
      </p>
    </aside>
  );
}
