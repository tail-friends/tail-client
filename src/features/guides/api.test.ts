import { expect, test } from "vitest";
import { sent, setServer } from "@/test/fakeServer";
import { fetchGuides, saveGuide } from "./api";

const leopard = {
  speciesId: 1,
  name: "레오파드 게코",
  sections: [
    { key: "HABIT", title: "습성", body: "야행성", updatedAt: "2026-10-18" },
    { key: "FEED", title: "먹이", body: "귀뚜라미", updatedAt: "2026-10-21" },
  ],
};

test("종마다 가이드를 불러와 칸을 채우고 가장 최근 수정 날짜를 쓴다", async () => {
  setServer(({ url }) => {
    if (url === "/admin/species")
      return [200, { data: { species: [{ id: 1 }, { id: 2 }] } }];
    if (url === "/species/1/guide") return [200, { data: leopard }];
    if (url === "/species/2/guide")
      return [200, { data: { speciesId: 2, name: "볼 파이톤", sections: [] } }];
    return [404, {}];
  });

  expect(await fetchGuides()).toEqual([
    {
      id: 1,
      name: "레오파드 게코",
      content: { 습성: "야행성", 먹이: "귀뚜라미", 환경: "", 건강: "" },
      updatedAt: "2026.10.21",
    },
    {
      id: 2,
      name: "볼 파이톤",
      content: { 습성: "", 먹이: "", 환경: "", 건강: "" },
      updatedAt: undefined,
    },
  ]);
});

test("저장할 때 빈 칸은 빼고 서버 섹션 키로 보낸다", async () => {
  setServer(() => [200, { data: leopard }]);

  const saved = await saveGuide(1, {
    습성: "야행성",
    먹이: "귀뚜라미",
    환경: "  ",
    건강: "",
  });

  const [request] = sent("/admin/species/1/guide");
  expect(request.method).toBe("put");
  expect(JSON.parse(request.data)).toEqual({
    sections: [
      { key: "HABIT", body: "야행성" },
      { key: "FEED", body: "귀뚜라미" },
    ],
  });
  expect(saved.updatedAt).toBe("2026.10.21");
});
