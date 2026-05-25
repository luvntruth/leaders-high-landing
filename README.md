# 렛미프리(Letmefree) — Landing Page

Meta 광고 A/B 테스트용 랜딩 페이지. Next.js 16 App Router + Tailwind 4 + Framer Motion.

## Variant 구조

URL 쿼리 `?lp=` 로 Hero/Problem 카피가 분기됩니다.

| Variant | URL 접두 | 타겟 |
|---------|----------|------|
| practice (기본) | `?lp=practice` 또는 `?lp=` 생략 | 신임·중간 팀장, "연습" 소구 |
| diagnosis | `?lp=diagnosis` | 현직 팀장, "이미 꼬인 면담 복기" 소구 |
| new-manager | `?lp=new-manager` | 신임 팀장 전용, "첫 면담" 소구 |

각 variant 는 `<title>`, `<meta name="description">`, `og:title`, `og:description` 이 모두 다릅니다 — 소셜 미리보기·검색 스니펫·카톡 공유에서 차별화됩니다.

## Meta 광고 연결 규약

메타 광고 크리에이티브의 "Website URL" 필드에 아래 형식으로 설정:

```
https://leaders-high-landing.vercel.app/?lp=<VARIANT>&utm_source=meta&utm_medium=cpc&utm_campaign=<CAMPAIGN_ID>&utm_content=<AD_NAME>
```

CTA 클릭 시 `lp`, `cta`, `utm_*` 가 메인 앱(`app.letmefree.xyz`) 으로 전달되어 퍼널 분석에 사용됩니다.

## 환경변수

`.env.example` 복사 → `.env.local` 또는 Vercel Env.

- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID (설정 시 픽셀 자동 설치)
- `NEXT_PUBLIC_SERVICE_URL` — 메인 서비스 URL (기본: app.letmefree.xyz)

## 로컬 개발

```bash
npm install
npm run dev
```

기본 포트: `http://localhost:3000`

Variant 확인: `http://localhost:3000/?lp=diagnosis`

## 배포 (Vercel)

1. Vercel 대시보드에서 이 GitHub 레포를 Import.
2. Environment Variables 에 위 키 2종 등록.
3. Production 배포 도메인 확인 (예: `leaders-high-landing.vercel.app`).
4. Meta Pixel 설치 확인: 배포 후 페이지 열기 → Chrome 확장 "Meta Pixel Helper" 또는 DevTools Network 에 `tr/?id=...` 요청 확인.

## 트래킹 이벤트

모든 CTA 클릭 시 아래 경로로 기록됩니다.

1. `window.dispatchEvent('leadershigh:tracking', detail:{name, payload})` — 커스텀 리스너용
2. `fbq('trackCustom', name, payload)` — Meta Pixel (설치 시)
3. `console.info` — 로컬 디버그용

주요 이벤트 이름:
- `landing_variant_view` — 페이지 진입
- `cta_click` — CTA 버튼 클릭 (placement 필드로 위치 식별)
- `scroll_depth_*` — 스크롤 깊이 (구현 시)

## 후속 작업 (Open Items)

- [ ] Variant 별 `og:image` 파일 추가 (1200×630 px, 3장) → `public/og/` 배치 후 `page.tsx` 의 `openGraph.images` 추가
- [ ] `sitemap.ts` 추가 (App Router 지원)
- [ ] `robots.txt` 추가
- [ ] Meta CAPI (Conversions API) 서버측 연동 — Vercel Function + `META_CAPI_ACCESS_TOKEN` 시크릿 필요
- [ ] 메인 앱(`leader-s-high`) 에도 fbq 설치 → `fbclid` 기반 딥링크 중복제거
