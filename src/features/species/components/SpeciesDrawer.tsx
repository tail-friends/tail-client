"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import Field from "./Field";
import SegmentField from "./SegmentField";
import { homes, shapes, type Species } from "./SpeciesTable";

type Errors = { name?: string; feed?: string; humidity?: string };

const toNumber = (v: string) => (v.trim() === "" ? undefined : Number(v));

// Figma W-3e · W-3b · W-3a 오른쪽 패널. 열릴 때마다 새로 만들어 입력값을 비운다
export default function SpeciesDrawer({
  title,
  species,
  isDuplicate,
  onSave,
  onClose,
}: {
  title: string;
  species: Partial<Species>;
  isDuplicate: (name: string) => boolean;
  onSave: (s: Species) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(species.name ?? "");
  const [feed, setFeed] = useState(species.feedDays?.toString() ?? "");
  const [molt, setMolt] = useState(species.moltDays?.toString() ?? "");
  const [shape, setShape] = useState(species.shape ?? shapes[0]);
  const [spike, setSpike] = useState(species.spike ?? false);
  const [home, setHome] = useState(species.home ?? homes[0]);
  const [hot, setHot] = useState(species.hot?.toString() ?? "");
  const [cool, setCool] = useState(species.cool?.toString() ?? "");
  const [humidity, setHumidity] = useState(species.humidity?.toString() ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function save() {
    const next: Errors = {};
    const trimmed = name.trim();
    if (!trimmed) next.name = "이름을 입력해 주세요";
    else if (isDuplicate(trimmed)) next.name = "같은 이름의 종이 이미 있어요";
    const feedDays = Number(feed);
    if (!Number.isInteger(feedDays) || feedDays < 1 || feedDays > 60)
      next.feed = "1~60일 사이로 입력해 주세요";
    const h = toNumber(humidity);
    if (h !== undefined && !(h >= 0 && h <= 100))
      next.humidity = "0~100% 사이로 입력해 주세요";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave({
      name: trimmed,
      feedDays,
      shape,
      spike,
      home,
      hidden: species.hidden ?? false,
      moltDays: toNumber(molt),
      hot: toNumber(hot),
      cool: toNumber(cool),
      humidity: h,
    });
  }

  return (
    <>
      <div className="bg-fg/14 fixed inset-0 z-10 backdrop-blur-[0.1875rem]" />
      <div className="fixed top-4 right-4 bottom-4 z-20 isolate w-120">
        <aside className="glass flex h-full flex-col gap-4 rounded-xl p-6 [--glass-from:1] [--glass-to:1]">
          <div className="flex items-center">
            <h2 className="text-display-md flex-1">{title}</h2>
            <button type="button" onClick={onClose} className="cursor-pointer">
              <Image src="/icons/close.svg" alt="닫기" width={20} height={20} />
            </button>
          </div>
          <Field
            label="이름"
            placeholder="예: 이구아나"
            value={name}
            error={errors.name}
            onChange={setName}
          />
          <div className="flex gap-3 [&>label]:flex-1">
            <Field
              label="급여 주기 (일 · 1~60)"
              placeholder="예: 3"
              type="number"
              value={feed}
              error={errors.feed}
              onChange={setFeed}
            />
            <Field
              label="탈피 주기 (일)"
              placeholder="예: 30"
              type="number"
              value={molt}
              onChange={setMolt}
            />
          </div>
          <SegmentField
            label="체형"
            options={shapes}
            value={shape}
            onChange={setShape}
          />
          <SegmentField
            label="가시 여부 (드래곤·이구아나)"
            options={["없음", "있음"]}
            value={spike ? "있음" : "없음"}
            onChange={(v) => setSpike(v === "있음")}
          />
          <SegmentField
            label="기본 사육장"
            options={homes}
            value={home}
            onChange={setHome}
          />
          <div className="flex gap-3 [&>label]:flex-1">
            <Field
              label="핫존 (℃)"
              placeholder="예: 32"
              type="number"
              value={hot}
              onChange={setHot}
            />
            <Field
              label="쿨존 (℃)"
              placeholder="예: 26"
              type="number"
              value={cool}
              onChange={setCool}
            />
            <Field
              label="습도 (% · 0~100)"
              placeholder="예: 40"
              type="number"
              value={humidity}
              error={errors.humidity}
              onChange={setHumidity}
            />
          </div>
          <div className="mt-auto flex items-center gap-2.5">
            <p className="text-caption text-fg-tertiary flex-1">
              저장하면 앱의 종 선택 목록에 바로 반영돼요
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-body border-line cursor-pointer rounded-full border bg-linear-to-br from-white/19 to-white/13 px-4.5 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-[1.125rem]"
            >
              취소
            </button>
            <Button onClick={save}>저장</Button>
          </div>
        </aside>
      </div>
    </>
  );
}
