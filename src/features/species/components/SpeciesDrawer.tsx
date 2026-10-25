import Image from "next/image";
import Button from "@/components/Button";
import Field from "./Field";
import SegmentField from "./SegmentField";
import { homes, shapes } from "./SpeciesTable";

// Figma W-3e · W-3b · W-3a 오른쪽 패널. 값과 오류는 화면마다 넘겨 받는다
export default function SpeciesDrawer({
  title,
  values = {},
  errors = {},
}: {
  title: string;
  values?: { name?: string; feed?: string; humidity?: string };
  errors?: { name?: string; feed?: string; humidity?: string };
}) {
  return (
    <>
      <div className="bg-fg/14 fixed inset-0 z-10 backdrop-blur-[0.1875rem]" />
      <div className="fixed top-4 right-4 bottom-4 z-20 isolate w-120">
        <aside className="glass flex h-full flex-col gap-4 rounded-xl p-6 [--glass-from:1] [--glass-to:1]">
          <div className="flex items-center">
            <h2 className="text-display-md flex-1">{title}</h2>
            <Image src="/icons/close.svg" alt="닫기" width={20} height={20} />
          </div>
          <Field
            label="이름"
            placeholder="예: 이구아나"
            value={values.name}
            error={errors.name}
          />
          <div className="flex gap-3 [&>div]:flex-1">
            <Field
              label="급여 주기 (일 · 1~60)"
              placeholder="예: 3"
              value={values.feed}
              error={errors.feed}
            />
            <Field label="탈피 주기 (일)" placeholder="예: 30" />
          </div>
          <SegmentField label="체형" options={shapes} value="gecko" />
          <SegmentField
            label="가시 여부 (드래곤·이구아나)"
            options={["없음", "있음"]}
            value="없음"
          />
          <SegmentField label="기본 사육장" options={homes} value="사막" />
          <div className="flex gap-3 [&>div]:flex-1">
            <Field label="핫존 (℃)" placeholder="예: 32" />
            <Field label="쿨존 (℃)" placeholder="예: 26" />
            <Field
              label="습도 (% · 0~100)"
              placeholder="예: 40"
              value={values.humidity}
              error={errors.humidity}
            />
          </div>
          <div className="mt-auto flex items-center gap-2.5">
            <p className="text-caption text-fg-tertiary flex-1">
              저장하면 앱의 종 선택 목록에 바로 반영돼요
            </p>
            <button
              type="button"
              className="text-body border-line cursor-pointer rounded-full border bg-linear-to-br from-white/19 to-white/13 px-4.5 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem]"
            >
              취소
            </button>
            <Button>저장</Button>
          </div>
        </aside>
      </div>
    </>
  );
}
