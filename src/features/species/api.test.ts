import { expect, test } from "vitest";
import { setServer } from "@/test/fakeServer";
import { getSpecies } from "./api";

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
