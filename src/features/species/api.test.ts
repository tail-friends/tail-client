import { expect, test } from "vitest";
import { sent, setServer } from "@/test/fakeServer";
import { getSpecies, inputError, saveSpecies } from "./api";

const leopard = {
  id: 1,
  name: "레오파드 게코",
  shape: "gecko",
  spiky: false,
  feedIntervalDays: 4,
  shedIntervalDays: null,
  envRange: {
    hot: { min: 34, max: 36 },
    cool: null,
    humidity: { min: 30, max: null },
  },
  defaultHome: "desert",
  hidden: true,
};

test("서버 종을 화면 형식으로 바꾸고 비어 있는 값은 undefined로 둔다", async () => {
  setServer(() => [200, { data: { species: [leopard] } }]);

  expect(await getSpecies()).toEqual([
    {
      id: 1,
      name: "레오파드 게코",
      feedDays: 4,
      shape: "gecko",
      spike: false,
      home: "사막",
      hidden: true,
      moltDays: undefined,
      hotMin: 34,
      hotMax: 36,
      coolMin: undefined,
      coolMax: undefined,
      humidityMin: 30,
      humidityMax: undefined,
    },
  ]);
});

const input = {
  name: "레오파드 게코",
  feedDays: 4,
  shape: "gecko",
  spike: false,
  home: "바위 협곡",
  hidden: true,
  hotMin: 34,
  hotMax: 36,
} as const;

test("id가 없으면 POST로 추가하고, 숨김과 빈 값은 보내지 않는다", async () => {
  setServer(() => [201, { data: leopard }]);

  const saved = await saveSpecies(undefined, input);

  const [request] = sent("/admin/species");
  expect(request.method).toBe("post");
  expect(JSON.parse(request.data)).toEqual({
    name: "레오파드 게코",
    shape: "gecko",
    spiky: false,
    feedIntervalDays: 4,
    hotMin: 34,
    hotMax: 36,
    defaultHome: "rock",
  });
  expect(saved.id).toBe(1);
});

test("id가 있으면 PATCH로 수정한다", async () => {
  setServer(() => [200, { data: leopard }]);

  await saveSpecies(1, input);

  expect(sent("/admin/species/1")[0].method).toBe("patch");
});

test("400이면 서버 안내문을 입력 오류로 쓰고, 다른 실패는 입력 오류가 아니다", async () => {
  const failure = () => saveSpecies(undefined, input).catch((e: unknown) => e);
  const body = {
    error: { code: "INVALID_INPUT", message: "이미 있는 종 이름이에요" },
  };

  setServer(() => [400, body]);
  expect(inputError(await failure())).toBe("이미 있는 종 이름이에요");

  setServer(() => [500, body]);
  expect(inputError(await failure())).toBeUndefined();
});
