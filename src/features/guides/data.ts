export const sections = ["습성", "먹이", "환경", "건강"] as const;

export type Section = (typeof sections)[number];
export type Content = Record<Section, string>;

export type Guide = {
  id: string;
  name: string;
  content: Content;
  // 작성 전이면 없다. "2026.10.20" 형식
  updatedAt?: string;
};

const empty: Content = { 습성: "", 먹이: "", 환경: "", 건강: "" };

// 퍼블리싱용 고정값. 서버 연결 전까지 Figma 시안의 목록을 그대로 쓴다
// shortcut: 레오파드 게코 말고는 시안에 본문이 없어 빈 칸으로 둔다, API 연결할 때 교체
export const guides: Guide[] = [
  {
    id: "leopard-gecko",
    name: "레오파드 게코",
    updatedAt: "2026.10.20",
    content: {
      습성: "야행성이라 낮에는 은신처에서 쉬어요. 성격이 온순해서 손에 올리는 연습을 천천히 하면 잘 적응해요.",
      먹이: "귀뚜라미·밀웜 같은 살아 있는 곤충을 먹어요. 성체는 4일에 한 번, 어린 개체는 더 자주 주세요.",
      환경: "바닥 한쪽은 따뜻하게, 반대쪽은 서늘하게 온도 차를 만들어 주세요. 습식 은신처가 있으면 탈피가 쉬워요.",
      건강: "꼬리가 갑자기 가늘어지면 체중을 확인하세요. 안 먹음이 3번 이어지면 병원에 가 보는 게 좋아요.",
    },
  },
  {
    id: "crested-gecko",
    name: "크레스티드 게코",
    updatedAt: "2026.10.18",
    content: empty,
  },
  { id: "gargoyle-gecko", name: "가고일 게코", content: empty },
  {
    id: "bearded-dragon",
    name: "비어디드 드래곤",
    updatedAt: "2026.10.12",
    content: empty,
  },
  { id: "blue-tongue-skink", name: "블루텅 스킨크", content: empty },
  {
    id: "ball-python",
    name: "볼 파이톤",
    updatedAt: "2026.10.09",
    content: empty,
  },
  { id: "corn-snake", name: "콘 스네이크", content: empty },
  { id: "hognose-snake", name: "호그노즈 스네이크", content: empty },
  { id: "king-snake", name: "킹 스네이크", content: empty },
  { id: "tortoise", name: "육지 거북", content: empty },
];
