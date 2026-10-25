import Button from "@/components/Button";
import Chip from "@/components/Chip";
import { sections, type Content, type Section } from "../data";

export type GuideStatus = "saved" | "dirty" | "empty";

const chip = {
  saved: { tone: "success", label: "저장됨" },
  dirty: { tone: "warning", label: "저장 안 됨" },
  empty: { tone: "muted", label: "작성 전" },
} as const;

// Figma editor. 고친 내용이 있을 때만 되돌리기·저장 버튼이 켜진다.
// activeSection은 고치는 중인 칸(초록 테두리)
export default function GuideEditor({
  name,
  content,
  status,
  updatedAt,
  activeSection,
}: {
  name: string;
  content: Content;
  status: GuideStatus;
  updatedAt?: string;
  activeSection?: Section;
}) {
  const { tone, label } = chip[status];

  return (
    <section className="glass flex min-w-0 flex-1 flex-col gap-3.5 rounded-xl [--glass-from:0.78] [--glass-to:0.4] px-6 py-5.5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-display-md flex-1">{name} 가이드</h2>
        <Chip tone={tone}>{label}</Chip>
      </div>
      {sections.map((section) => (
        <label key={section} className="flex flex-col gap-1.5">
          <span className="text-label text-fg-secondary">{section}</span>
          <textarea
            defaultValue={content[section]}
            placeholder={`${section} 내용을 적어 주세요`}
            className={`text-body placeholder:text-fg-tertiary focus:border-primary focus:shadow-[inset_0_0_0_0.03125rem_var(--color-primary)] h-18 resize-none rounded-md border bg-white px-3.5 py-3 outline-none ${section === activeSection ? "border-primary shadow-[inset_0_0_0_0.03125rem_var(--color-primary)]" : "border-line"}`}
          />
        </label>
      ))}
      <div className="mt-auto flex items-center gap-2.5">
        <p className="text-caption text-fg-tertiary flex-1">
          {updatedAt
            ? `마지막 수정 ${updatedAt} · 운영자`
            : "아직 작성하지 않았어요"}
        </p>
        <Button variant="ghost" disabled={status !== "dirty"} className="w-20">
          되돌리기
        </Button>
        <Button disabled={status !== "dirty"} className="w-14.5">
          저장
        </Button>
      </div>
    </section>
  );
}
