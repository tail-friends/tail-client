"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import Field from "./Field";
import SegmentField from "./SegmentField";
import { homes, shapes, type Species } from "./SpeciesTable";

const blank: Species = {
  name: "",
  feedDays: NaN,
  shape: "gecko",
  spike: false,
  home: "사막",
  shedDays: null,
  hotZone: null,
  coolZone: null,
  humidity: null,
  hidden: false,
};

const toText = (n: number | null) => (n === null || Number.isNaN(n) ? "" : `${n}`);
const toNumber = (text: string) => (text.trim() === "" ? null : Number(text));
const outOfRange = (n: number | null, min: number, max: number) =>
  n !== null && !(Number.isInteger(n) && n >= min && n <= max);

// Figma W-3e · W-3b · W-3a 오른쪽 패널. species가 있으면 수정, 없으면 추가
export default function SpeciesDrawer({
  species,
  names,
  onSave,
  onClose,
}: {
  species?: Species;
  names: string[];
  onSave: (species: Species) => void;
  onClose: () => void;
}) {
  const initial = species ?? blank;
  const [form, setForm] = useState({
    name: initial.name,
    feed: toText(initial.feedDays),
    shed: toText(initial.shedDays),
    hot: toText(initial.hotZone),
    cool: toText(initial.coolZone),
    humidity: toText(initial.humidity),
  });
  const [shape, setShape] = useState(initial.shape);
  const [spike, setSpike] = useState(initial.spike);
  const [home, setHome] = useState(initial.home);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const name = form.name.trim();
  const feed = toNumber(form.feed);
  const humidity = toNumber(form.humidity);
  const errors = {
    name: !name
      ? "이름을 입력해 주세요"
      : names.some((n) => n === name && n !== species?.name)
        ? "같은 이름의 종이 이미 있어요"
        : undefined,
    feed: feed === null || outOfRange(feed, 1, 60) ? "1~60일 사이로 입력해 주세요" : undefined,
    humidity: outOfRange(humidity, 0, 100) ? "0~100% 사이로 입력해 주세요" : undefined,
  };
  const show = submitted ? errors : {};

  const save = () => {
    setSubmitted(true);
    if (errors.name || errors.feed || errors.humidity) return;
    onSave({
      ...initial,
      name,
      feedDays: feed!,
      shape,
      spike,
      home,
      shedDays: toNumber(form.shed),
      hotZone: toNumber(form.hot),
      coolZone: toNumber(form.cool),
      humidity,
    });
  };

  return (
    <>
      <div
        onClick={onClose}
        className="bg-fg/14 fixed inset-0 z-10 backdrop-blur-[0.1875rem]"
      />
      <div className="fixed top-4 right-4 bottom-4 z-20 isolate w-120">
        <aside className="glass [--glass-from:1] [--glass-to:1] flex h-full flex-col gap-4 rounded-xl p-6">
          <div className="flex items-center">
            <h2 className="text-display-md flex-1">
              {species ? `종 수정 · ${species.name}` : "새 종 추가"}
            </h2>
            <button type="button" aria-label="닫기" onClick={onClose} className="cursor-pointer">
              <Image src="/icons/close.svg" alt="" width={20} height={20} />
            </button>
          </div>
          <Field label="이름" placeholder="예: 이구아나" value={form.name} onChange={set("name")} error={show.name} />
          <div className="flex gap-3 [&>label]:flex-1">
            <Field label="급여 주기 (일 · 1~60)" placeholder="예: 3" value={form.feed} onChange={set("feed")} error={show.feed} />
            <Field label="탈피 주기 (일)" placeholder="예: 30" value={form.shed} onChange={set("shed")} />
          </div>
          <SegmentField label="체형" options={shapes} value={shape} onChange={setShape} />
          <SegmentField
            label="가시 여부 (드래곤·이구아나)"
            options={["없음", "있음"] as const}
            value={spike ? "있음" : "없음"}
            onChange={(v) => setSpike(v === "있음")}
          />
          <SegmentField label="기본 사육장" options={homes} value={home} onChange={setHome} />
          <div className="flex gap-3 [&>label]:flex-1">
            <Field label="핫존 (℃)" placeholder="예: 32" value={form.hot} onChange={set("hot")} />
            <Field label="쿨존 (℃)" placeholder="예: 26" value={form.cool} onChange={set("cool")} />
            <Field label="습도 (% · 0~100)" placeholder="예: 40" value={form.humidity} onChange={set("humidity")} error={show.humidity} />
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
