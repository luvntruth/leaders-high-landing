import type { Metadata } from "next";
import LandingContent from "./landing-content";

type LandingVariant = "practice" | "diagnosis" | "new-manager";

const VARIANT_META: Record<
  LandingVariant,
  { title: string; description: string; ogDescription: string }
> = {
  practice: {
    title: "Leader's High — 팀원과의 어려운 대화, 연습하면 달라집니다",
    description:
      "AI 팀원과 40가지 실전 면담 시나리오를 연습하며 리더십 스킬을 키우세요. 가입 없이 무료 3개 시나리오부터 시작.",
    ogDescription:
      "팀원과의 어려운 대화, 연습하면 달라집니다. 실시간 AI 코칭으로 리더십을 키우세요.",
  },
  diagnosis: {
    title: "Leader's High — 꼬인 면담, AI 와 다시 진단해보세요",
    description:
      "이미 지나간 어려운 대화도 복기하고, AI 코칭으로 다음 면담을 준비하세요. 3개 시나리오 무료 진단.",
    ogDescription:
      "그 대화가 왜 꼬였는지, AI 와 다시 진단해보세요. 구체적인 대안 발화까지.",
  },
  "new-manager": {
    title: "Leader's High — 신임 팀장의 첫 면담 연습",
    description:
      "처음 팀장이 된 순간, 가장 먼저 필요한 건 대화 연습입니다. AI 시뮬레이터로 안전하게 준비하세요.",
    ogDescription:
      "처음 팀장이 된 순간, 가장 먼저 필요한 건 대화 연습입니다.",
  },
};

function resolveVariant(raw: string | string[] | undefined): LandingVariant {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "practice" || v === "diagnosis" || v === "new-manager") return v;
  return "practice";
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
