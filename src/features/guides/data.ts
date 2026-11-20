export const sections = ["습성", "먹이", "환경", "건강"] as const;

export type Section = (typeof sections)[number];
export type Content = Record<Section, string>;

export type Guide = {
  id: number;
  name: string;
  content: Content;
  // 작성 전이면 없다. "2026.10.20" 형식
  updatedAt?: string;
};
