import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leader's High — AI 리더십 코칭 시뮬레이터",
  description:
    "AI 팀원과 40가지 실전 면담 시나리오를 연습하고, 실시간 코칭으로 리더십 스킬을 키우세요. 신임 팀장을 위한 안전한 연습 공간.",
  openGraph: {
    title: "Leader's High — AI 리더십 코칭 시뮬레이터",
    description:
      "팀원과의 어려운 대화, 연습하면 달라집니다. 40가지 실전 시나리오와 실시간 AI 코칭.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
