import type { Metadata } from "next";
import LandingContent from "./landing-content";

type LandingVariant = "practice" | "diagnosis" | "new-manager";

const VARIANT_META: Record<
  LandingVariant,
  { title: string; description: string; ogDescription: string }
> = {
  practice: {
    title: "렛미프리 — 팀원과의 어려운 대화, 연습하면 달라집니다",
    description:
      "AI 팀원의 신뢰도와 감정 변화를 실시간으로 보며 실전 면담을 리허설하세요. 가입 없이 3개 시나리오 무료.",
    ogDescription:
      "팀원과의 어려운 대화, 연습하면 달라집니다. 신뢰도 게이지로 보는 실시간 AI 코칭.",
  },
  diagnosis: {
    title: "렛미프리 — 꼬인 면담, AI 와 다시 진단해보세요",
    description:
      "지나간 어려운 대화를 재현하고, 어디서 신뢰가 흔들렸는지 신뢰도 변화로 확인하세요. 3개 시나리오 무료 진단.",
    ogDescription:
      "그 대화가 왜 꼬였는지, AI 와 다시 진단해보세요. 강점·개선점·모범 답안까지.",
  },
  "new-manager": {
    title: "렛미프리 — 신임 팀장의 첫 면담 연습",
    description:
      "처음 팀장이 된 순간, 가장 먼저 필요한 건 대화 연습입니다. AI 시뮬레이터로 안전하게 리허설하세요.",
    ogDescription:
      "처음 팀장이 된 순간, 가장 먼저 필요한 건 대화 연습입니다.",
  },
};

function resolveVariant(raw: string | string[] | undefined): LandingVariant {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "practice" || v === "diagnosis" || v === "new-manager") return v;
  // 기본 랜딩: '진단'(diagnosis) — 광고 테스트에서 클릭률 최고로 확정.
  return "diagnosis";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const variant = resolveVariant(params.lp);
  const m = VARIANT_META[variant];

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      type: "website",
      locale: "ko_KR",
    },
  };
}

export default function Home() {
  return <LandingContent />;
}
