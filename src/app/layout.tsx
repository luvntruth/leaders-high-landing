import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

/**
 * Root Metadata — page.tsx 의 generateMetadata 가 variant 별로 오버라이드함.
 * 여기 값은 variant 미지정(root 접근) 시의 기본값 역할.
 */
export const metadata: Metadata = {
  title: "렛미프리 — AI 리더십 코칭 시뮬레이터",
  description:
    "AI 팀원의 신뢰도와 감정 변화를 실시간으로 보며 40가지 실전 면담 시나리오를 연습하세요. 신임 팀장을 위한 안전한 연습 공간.",
  openGraph: {
    title: "렛미프리 — AI 리더십 코칭 시뮬레이터",
    description:
      "팀원과의 어려운 대화, 연습하면 달라집니다. 신뢰도 게이지로 보는 실시간 AI 코칭.",
    type: "website",
    locale: "ko_KR",
  },
};

// Meta Pixel — env 주도. NEXT_PUBLIC_META_PIXEL_ID 미설정 시 조용히 비활성.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
      <body className="antialiased">
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel-base" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
