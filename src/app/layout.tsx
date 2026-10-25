import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua" });

export const metadata: Metadata = {
  title: "꼬리친구 관리자",
  description: "내 파충류의 급여·탈피·체중 기록을 캐릭터와 함께.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
