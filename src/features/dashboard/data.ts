// 퍼블리싱용 고정 데이터 (Figma W-2). API 연동 때 교체한다
export const stats = [
  { label: "가입자 수", value: "1,284", note: "어제보다 +32" },
  { label: "등록 개체 수", value: "2,031", note: "어제보다 +47" },
  { label: "오늘 AI 분석 횟수", value: "146", note: "최근 30일 평균 118" },
  { label: "AI 분석 실패율 (오늘)", value: "2.7%", note: "실패 4건" },
];

// 9/25부터 30일, [분석 횟수, 그중 실패]
const counts = [
  [92, 9],
  [104, 6],
  [98, 12],
  [120, 15],
  [131, 9],
  [88, 6],
  [79, 3],
  [110, 12],
  [118, 18],
  [125, 9],
  [140, 12],
  [97, 6],
  [85, 6],
  [112, 9],
  [128, 15],
  [133, 12],
  [121, 9],
  [90, 6],
  [84, 3],
  [115, 9],
  [126, 12],
  [138, 18],
  [144, 15],
  [101, 6],
  [95, 9],
  [119, 9],
  [130, 12],
  [137, 15],
  [152, 18],
  [146, 4],
];

export const daily = counts.map(([total, fail], i) => {
  const d = new Date(2026, 8, 25 + i);
  return { date: `${d.getMonth() + 1}/${d.getDate()}`, total, fail };
});

export const speciesCounts = [
  { name: "레오파드 게코", count: 812 },
  { name: "크레스티드 게코", count: 401 },
  { name: "비어디드 드래곤", count: 236 },
  { name: "볼 파이톤", count: 188 },
  { name: "가고일 게코", count: 121 },
  { name: "콘 스네이크", count: 97 },
  { name: "블루텅 스킨크", count: 72 },
  { name: "호그노즈 스네이크", count: 51 },
  { name: "육지 거북", count: 35 },
  { name: "킹 스네이크", count: 18 },
];
