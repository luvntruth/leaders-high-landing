"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Target,
  Shield,
  Zap,
  BarChart3,
  ChevronDown,
  Menu,
  Brain,
  Users,
  FileText,
  Clock,
  LifeBuoy,
  BookOpen,
  FlaskConical,
  Activity,
} from "lucide-react";

const SERVICE_URL =
  process.env.NEXT_PUBLIC_SERVICE_URL ||
  "https://app.letmefree.xyz/#/onboarding";

const LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ||
  "https://app.letmefree.xyz/#/login";

type LandingVariant = "practice" | "diagnosis" | "new-manager";

const VARIANT_CONFIG: Record<
  LandingVariant,
  {
    badge: string;
    headline: string[];
    description: string[];
    primaryCta: string;
    secondaryCta: string;
    microcopy: string;
    problemEyebrow: string;
    problemTitle: string;
    problemDescription: string;
  }
> = {
  practice: {
    badge: "AI 리더십 코칭 시뮬레이터",
    headline: ["팀원과의 어려운 대화,", "연습하면 달라집니다"],
    description: [
      "AI 팀원의 신뢰도와 감정 변화를 실시간으로 보며,",
      "실전 면담을 안전하게 리허설하세요.",
    ],
    primaryCta: "무료 체험 시작",
    secondaryCta: "어떻게 작동하나요?",
    microcopy: "가입 없이 바로 시작 · 3개 시나리오 무료",
    problemEyebrow: "공감",
    problemTitle: "팀장이 되면 아무도 안 알려주는 것들",
    problemDescription: "처음 팀장이 된 당신, 이런 상황에서 어떻게 하시겠어요?",
  },
  diagnosis: {
    badge: "AI 리더십 진단 시뮬레이터",
    headline: ["그 대화가 왜 꼬였는지,", "AI와 다시 진단해보세요"],
    description: [
      "이미 지나간 어려운 면담을 재현하고,",
      "어디서 신뢰가 흔들렸는지 신뢰도 변화로 확인하세요.",
    ],
    primaryCta: "문제 대화 진단하기",
    secondaryCta: "진단 방식 보기",
    microcopy: "가입 없이 바로 시작 · 문제 대화 3개 무료 진단",
    problemEyebrow: "문제 인식",
    problemTitle: "대화는 끝났는데, 찜찜함은 남아 있나요?",
    problemDescription: "어디서 잘못 말했는지 모르겠다면, 다시 재현하고 진단해야 합니다.",
  },
  "new-manager": {
    badge: "신임 팀장용 AI 코칭 시뮬레이터",
    headline: ["처음 팀장이 된 순간,", "가장 먼저 필요한 건", "대화 연습입니다"],
    description: [
      "피드백, 면담, 갈등 조율까지 막막한 순간을,",
      "AI 팀원과 안전하게 먼저 연습해보세요.",
    ],
    primaryCta: "신임 팀장 연습 시작",
    secondaryCta: "어떤 상황이 있나요?",
    microcopy: "가입 없이 바로 시작 · 신임 팀장 필수 시나리오 3개 무료",
    problemEyebrow: "신임 팀장",
    problemTitle: "처음 팀을 맡으면, 대화가 제일 어렵습니다",
    problemDescription: "실무는 익숙해도 면담은 처음이라면, 말 한마디가 더 무겁게 느껴집니다.",
  },
};

type AttributionParams = {
  lp: LandingVariant;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

type CtaContext = {
  variant: LandingVariant;
  attribution: AttributionParams;
  trackCtaClick: (placement: string, target: string) => void;
  buildTrackedServiceUrl: (placement: string) => string;
  buildTrackedLoginUrl: (placement: string) => string;
};

function normalizeVariant(value: string | null): LandingVariant {
  if (value === "practice" || value === "diagnosis" || value === "new-manager") {
    return value;
  }

  return "practice";
}

function readAttribution(search: string): AttributionParams {
  const params = new URLSearchParams(search);
  const lp = normalizeVariant(params.get("lp"));

  return {
    lp,
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
  };
}

function buildServiceUrl(attribution: AttributionParams, placement: string) {
  const targetUrl = new URL(SERVICE_URL);

  targetUrl.searchParams.set("lp", attribution.lp);
  targetUrl.searchParams.set("cta", placement);

  if (attribution.utm_source) targetUrl.searchParams.set("utm_source", attribution.utm_source);
  if (attribution.utm_medium) targetUrl.searchParams.set("utm_medium", attribution.utm_medium);
  if (attribution.utm_campaign) targetUrl.searchParams.set("utm_campaign", attribution.utm_campaign);
  if (attribution.utm_content) targetUrl.searchParams.set("utm_content", attribution.utm_content);
  if (attribution.utm_term) targetUrl.searchParams.set("utm_term", attribution.utm_term);

  return targetUrl.toString();
}

function buildLoginUrl(attribution: AttributionParams, placement: string) {
  const targetUrl = new URL(LOGIN_URL);

  targetUrl.searchParams.set("lp", attribution.lp);
  targetUrl.searchParams.set("cta", placement);

  if (attribution.utm_source) targetUrl.searchParams.set("utm_source", attribution.utm_source);
  if (attribution.utm_medium) targetUrl.searchParams.set("utm_medium", attribution.utm_medium);
  if (attribution.utm_campaign) targetUrl.searchParams.set("utm_campaign", attribution.utm_campaign);
  if (attribution.utm_content) targetUrl.searchParams.set("utm_content", attribution.utm_content);
  if (attribution.utm_term) targetUrl.searchParams.set("utm_term", attribution.utm_term);

  return targetUrl.toString();
}

function trackEvent(name: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("leadershigh:tracking", { detail: { name, payload } }));

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    try {
      fbq("trackCustom", name, payload);
    } catch {
      /* no-op */
    }
  }

  console.info(`[tracking] ${name}`, payload);
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* ─── Nav ─── */
function Nav({ buildTrackedServiceUrl, buildTrackedLoginUrl, trackCtaClick }: Pick<CtaContext, "buildTrackedServiceUrl" | "buildTrackedLoginUrl" | "trackCtaClick">) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "기능", href: "#features" },
    { label: "작동방식", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">
            L
          </span>
          Letmefree
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={buildTrackedLoginUrl("nav-desktop-login")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("nav-desktop-login", LOGIN_URL)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            로그인
          </a>
          <a
            href={buildTrackedServiceUrl("nav-desktop")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("nav-desktop", SERVICE_URL)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            무료로 시작하기
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="메뉴"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-border"
          >
            <div className="px-5 pb-4 flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-muted-foreground py-2"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={buildTrackedLoginUrl("nav-mobile-login")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("nav-mobile-login", LOGIN_URL)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                로그인
              </a>
              <a
                href={buildTrackedServiceUrl("nav-mobile")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("nav-mobile", SERVICE_URL)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                무료로 시작하기
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero({ variant, buildTrackedServiceUrl, trackCtaClick }: { variant: LandingVariant } & Pick<CtaContext, "buildTrackedServiceUrl" | "trackCtaClick">) {
  const content = VARIANT_CONFIG[variant];

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.585 0.233 277) 1px, transparent 1px), linear-gradient(90deg, oklch(0.585 0.233 277) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Gradient blob */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(ellipse, oklch(0.585 0.233 277 / 0.4), transparent 70%)" }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-5"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-6">
                <Sparkles className="h-3 w-3" />
                {content.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-foreground mb-5"
            >
              {content.headline[0]}
              <br />
              <span className="text-primary">{content.headline[1]}</span>
              {content.headline[2] ? (
                <>
                  <br />
                  <span className="text-primary">{content.headline[2]}</span>
                </>
              ) : null}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              {content.description[0]}
              <br className="hidden sm:block" />
              {content.description[1]}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href={buildTrackedServiceUrl("hero-primary")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("hero-primary", SERVICE_URL)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                {content.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {content.secondaryCta}
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 text-xs text-muted-foreground/70">
              {content.microcopy}
            </motion.p>
          </div>

          {/* Visual — Chat UI Mockup with Trust Gauge */}
          <motion.div
            variants={fadeUp}
            className="flex-1 w-full max-w-md lg:max-w-lg"
          >
            <div className="relative">
              {/* Main chat mockup */}
              <div className="rounded-2xl border border-border bg-white shadow-2xl shadow-black/5 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3.5 border-b border-border flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-sm">
                    😒
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">김철수</p>
                    <p className="text-[11px] text-muted-foreground">성과 좋은 만성 지각자 · B등급</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">진행 중</span>
                </div>

                {/* Trust gauge */}
                <div className="px-5 pt-4 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">신뢰도</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: "32%", backgroundColor: "#ef4444" }}
                        animate={{ width: "65%", backgroundColor: "#10b981" }}
                        transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 tabular-nums">65</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80">경계 → 점진적 수용으로 이동 중</p>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3 min-h-[200px]">
                  <div className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      😒
                    </div>
                    <div className="rounded-xl rounded-tl-sm bg-gray-100 px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
                      ...네, 뭐 팀장님이 그렇게 생각하시면 할 말은 없지만요.
                    </div>
                  </div>
                  <div className="flex gap-2.5 justify-end">
                    <div className="rounded-xl rounded-tr-sm bg-primary/10 px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
                      철수씨 입장에서 어떤 점이 가장 힘들었는지 좀 더 이야기해줄 수 있어요?
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      🙂
                    </div>
                    <div className="rounded-xl rounded-tl-sm bg-gray-100 px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
                      ...사실 마감 때문에 새벽까지 일한 적이 많은데, 지각 얘기만 나오면 좀 억울하긴 합니다.
                    </div>
                  </div>
                  {/* Coaching badge */}
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] text-emerald-700 font-medium">
                      <Zap className="h-3 w-3" />
                      즉시 코칭: 감정 인정 후 맥락 질문 — 신뢰도 +17
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating report card */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-48 rounded-xl border border-border bg-white shadow-lg p-3"
                initial={{ opacity: 0, y: 10, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">면담 리포트</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-600">강점</span>
                    <span className="font-medium">3건</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-rose-500">개선점</span>
                    <span className="font-medium">2건</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-primary">모범 답안</span>
                    <span className="font-medium">4건</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Problem ─── */
const problems = [
  { emoji: "😰", title: "저성과자 면담", desc: "성과가 낮은 팀원에게 어떻게 이야기를 꺼내야 할지 막막합니다." },
  { emoji: "🚪", title: "핵심인재 퇴사", desc: "퇴사를 고민하는 에이스, 무슨 말을 해야 붙잡을 수 있을까요?" },
  { emoji: "💥", title: "세대 갈등", desc: "MZ세대와 기성세대 사이에서 팀 분위기가 점점 나빠집니다." },
  { emoji: "😶", title: "피드백 불안", desc: "솔직한 피드백을 주면 관계가 나빠질까 봐 망설여집니다." },
];

function ProblemSection({ variant }: { variant: LandingVariant }) {
  const content = VARIANT_CONFIG[variant];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/80">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span className="text-sm font-medium text-rose-500 mb-2 block">{content.problemEyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {content.problemTitle}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {content.problemDescription}
          </p>
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto mt-3 leading-relaxed">
            무료 체험에서는 이 중 3개 시나리오(만성 지각자 · 워라밸 사수 · 권위 무시)를 먼저 만나고,
            나머지는 Pro / Ultra 에서 확장됩니다.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="group rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{p.emoji}</span>
              <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Solution ─── */
const solutions = [
  {
    icon: Users,
    title: "실제 팀원처럼 반응하는 AI",
    desc: "다양한 성격과 상황을 가진 AI 팀원이 한국 직장 문화의 뉘앙스까지 반영해 반응합니다. 무료 체험은 3개, 확장 시 최대 40개까지 만날 수 있습니다.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Zap,
    title: "대화 중 실시간 피드백",
    desc: "발언 하나하나에 즉시 코칭을 받고, SOS로 막히는 순간의 모범 발화를 확인합니다.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "실패해도 안전한 공간",
    desc: "실제 팀원 앞에서 실수하기 전에, 안전하게 연습하고 실력을 쌓으세요.",
    color: "bg-amber-50 text-amber-600",
  },
];

function SolutionSection() {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">해결책</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            실전처럼 연습하고, AI가 실시간으로 코칭합니다
          </h2>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-white p-7 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.color} mb-5`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Emotion Journey (NEW) ─── */
const emotionStages = [
  { range: "0-20", label: "강한 반발", emoji: "😡", desc: "공격적·회피적 반응", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600" },
  { range: "21-40", label: "경계·방어", emoji: "😒", desc: "짧고 방어적인 답변", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600" },
  { range: "41-55", label: "유보적 관망", emoji: "🤔", desc: "조심스러운 자기 표현", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
  { range: "56-70", label: "점진적 수용", emoji: "🙂", desc: "어려움을 조금씩 공유", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  { range: "71-85", label: "열린 대화", emoji: "😊", desc: "솔직한 속마음 공개", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
  { range: "86-100", label: "설득·합의", emoji: "🤝", desc: "스스로 개선안 제안", bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-600" },
];

function EmotionJourneySection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50/80 to-white">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-2">
            <Activity className="h-3.5 w-3.5" />
            차별화 코어
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            팀원의 마음이 어디서 움직이는지, 신뢰도로 확인하세요
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            렛미프리는 AI 팀원의 신뢰도(0~100)와 감정 상태를 실시간으로 분석합니다.
            어떤 말이 마음을 닫게 했는지, 어떤 말이 마음을 열게 했는지 즉시 보입니다.
          </p>
        </motion.div>

        {/* Stages strip */}
        <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {emotionStages.map((s) => (
            <motion.div
              key={s.range}
              variants={fadeUp}
              className={`rounded-xl border ${s.border} ${s.bg} p-4 text-center`}
            >
              <span className="text-2xl mb-1.5 block">{s.emoji}</span>
              <div className={`text-[10px] font-bold ${s.text} mb-1 tabular-nums`}>{s.range}</div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{s.label}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual rail */}
        <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
          <div className="relative h-3 rounded-full bg-gradient-to-r from-rose-300 via-amber-300 via-yellow-200 via-emerald-300 to-teal-400 overflow-hidden" />
          <div className="flex justify-between mt-2 px-1 text-[10px] font-medium text-muted-foreground tabular-nums">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            발언 하나하나가 신뢰도를 움직입니다. 어디서 신뢰가 흔들렸는지 곧바로 보이고,
            <br className="hidden sm:block" />
            다음 한 마디를 어떻게 바꿔야 할지도 함께 제안받습니다.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── How It Works ─── */
const steps = [
  {
    num: "01",
    icon: Target,
    title: "시나리오 선택",
    desc: "난이도 별로 제공되는 실전 면담 시나리오를\n선택하거나, 커스텀 랩으로 내 상황을 직접 입력합니다.",
  },
  {
    num: "02",
    icon: MessageCircle,
    title: "AI 팀원과 대화",
    desc: "실제 면담처럼 대화하면서 신뢰도 변화를 보고\n즉시 코칭과 SOS 도움을 받으세요.",
  },
  {
    num: "03",
    icon: FileText,
    title: "정밀 진단 리포트",
    desc: "강점·개선점·모범 답안과 액션 아이템이 담긴\n진단 리포트로 다음 면담을 준비하세요.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how" className="py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-sm font-medium text-primary mb-2 block">작동방식</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            3단계로 리더십을 업그레이드하세요
          </h2>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
              )}
              <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 mb-6">
                <s.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {s.num}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto whitespace-pre-line">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Features ─── */
type FeatureScope = "free" | "pro" | "soon";

const SCOPE_BADGE: Record<FeatureScope, { label: string; className: string }> = {
  free: { label: "무료 체험", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pro: { label: "Pro 이상", className: "bg-amber-50 text-amber-700 border-amber-200" },
  soon: { label: "준비 중", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

const features: Array<{
  icon: typeof Brain;
  title: string;
  desc: string;
  color: string;
  scope: FeatureScope;
}> = [
  {
    icon: Brain,
    title: "실전 대화 진단",
    desc: "시뮬레이션을 통해 경청, 공감, 질문, 피드백 중 어디서 대화가 흔들리는지 바로 확인합니다.",
    color: "text-primary bg-primary/10",
    scope: "free",
  },
  {
    icon: Zap,
    title: "즉시 코칭",
    desc: "내가 방금 한 말이 신뢰도에 어떤 영향을 줬는지 바로 피드백받고 다음 대응을 조정합니다.",
    color: "text-emerald-600 bg-emerald-50",
    scope: "pro",
  },
  {
    icon: LifeBuoy,
    title: "막히는 순간 SOS",
    desc: "어려운 순간에는 바로 쓸 수 있는 발언 예시와 대응 전략을 확인할 수 있습니다.",
    color: "text-rose-500 bg-rose-50",
    scope: "pro",
  },
  {
    icon: BookOpen,
    title: "이론 기반 미션 가이드",
    desc: "SBI 피드백 모델, 자기결정성 이론 등 경영학·심리학 이론에 근거한 정밀 미션을 진행합니다.",
    color: "text-indigo-600 bg-indigo-50",
    scope: "free",
  },
  {
    icon: FlaskConical,
    title: "커스텀 랩",
    desc: "오늘 면담할 그 팀원, 그 상황을 직접 입력해 나만의 시나리오로 연습할 수 있습니다.",
    color: "text-violet-600 bg-violet-50",
    scope: "soon",
  },
  {
    icon: BarChart3,
    title: "정밀 진단 리포트",
    desc: "강점·개선점·모범 답안까지 담은 정밀 진단 리포트로, 다음 면담에서 바로 쓸 표현을 가져갑니다.",
    color: "text-primary bg-primary/10",
    scope: "pro",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/80">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">핵심 기능</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            대화가 달라지도록 돕는 핵심 기능
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            무료 체험에서는 3개 시나리오 · 12턴 대화 · 간략 리포트를 먼저 경험합니다.
            반복 훈련 · 즉시 코칭 · 풀 리포트는 Pro/Ultra 에서 확장됩니다.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f) => {
            const badge = SCOPE_BADGE[f.scope];
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="relative rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <span
                  className={`absolute top-3 right-3 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color} mb-4`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5 pr-16">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Demo Preview ─── */
function DemoPreview({ buildTrackedServiceUrl, trackCtaClick }: Pick<CtaContext, "buildTrackedServiceUrl" | "trackCtaClick">) {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">미리보기</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            이런 느낌이에요
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            실제 서비스에서 AI 팀원과 면담하는 모습을 직접 확인해보세요.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          {/* Browser frame */}
          <div className="rounded-2xl border border-border bg-white shadow-2xl shadow-black/5 overflow-hidden max-w-4xl mx-auto">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-white rounded-md border border-border px-3 py-1 text-xs text-muted-foreground text-center">
                  app.letmefree.xyz
                </div>
              </div>
            </div>
            {/* Content area - dark themed to match actual app */}
            <div className="bg-[#0a0f1e] p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: scenario cards */}
                <div className="space-y-3">
                  <p className="text-cyan-400 text-xs font-medium mb-3 tracking-wider uppercase">Quest Board</p>
                  {[
                    { emoji: "😒", name: "성과 좋은 만성 지각자", diff: "B등급 · 쉬움", color: "border-emerald-500/30" },
                    { emoji: "😤", name: "이기적인 워라밸 사수", diff: "A등급 · 보통", color: "border-amber-500/30" },
                    { emoji: "💢", name: "연상 팀원의 권위 무시", diff: "S등급 · 도전", color: "border-rose-500/30" },
                  ].map((s) => (
                    <div key={s.name} className={`rounded-xl border ${s.color} bg-white/5 backdrop-blur px-4 py-3 flex items-center gap-3`}>
                      <span className="text-2xl">{s.emoji}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{s.name}</p>
                        <p className="text-gray-400 text-[11px]">난이도: {s.diff}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Right: stats */}
                <div className="space-y-3">
                  <p className="text-cyan-400 text-xs font-medium mb-3 tracking-wider uppercase">My Stats</p>
                  <div className="rounded-xl border border-cyan-500/20 bg-white/5 backdrop-blur p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Level</span>
                      <span className="text-cyan-400 font-bold">Lv.7</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-700">
                      <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Trust Score</span>
                      <span className="text-amber-400 font-bold">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">무료 체험</span>
                      <span className="text-emerald-400 font-bold">3개 시나리오</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href={buildTrackedServiceUrl("demo-preview")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("demo-preview", SERVICE_URL)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              직접 체험해보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Evidence ─── */
const evidencePoints = [
  {
    icon: Target,
    title: "무료 3개로 시작 → 최대 40개로 확장",
    desc: "무료 체험 3개로 먼저 감을 잡고, 필요하면 Pro 23개(무료 3개+직접 고르는 20개) / Ultra 40개로 반복 훈련 범위를 넓힙니다.",
  },
  {
    icon: Zap,
    title: "대화 중 즉시 피드백",
    desc: "좋았던 말과 위험했던 말을 바로 알려줘, 면담이 어디서 흔들리는지 즉시 파악할 수 있습니다.",
  },
  {
    icon: Clock,
    title: "짧게 시작, 바로 적용",
    desc: "한 번의 연습으로 끝내지 않고, 오늘 필요한 대화를 실제 면담 전에 빠르게 리허설할 수 있습니다.",
  },
];

function EvidenceSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-white to-slate-50/80">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="text-sm font-medium text-primary mb-2 block">왜 지금 필요한가</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            실전 전에 연습해야, 실제 대화가 덜 꼬입니다
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            렛미프리는 멋진 이론보다, 오늘 바로 써야 하는 어려운 대화를 먼저 연습하게 만드는 데 집중합니다.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-5">
          {evidencePoints.map((item) => (
            <motion.div key={item.title} variants={fadeUp} className="rounded-2xl border border-border bg-white p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Trial Card (Pricing 대체) ─── */
function TrialCard({ buildTrackedServiceUrl, trackCtaClick }: Pick<CtaContext, "buildTrackedServiceUrl" | "trackCtaClick">) {
  return (
    <section id="trial" className="py-16 md:py-20">
      <motion.div
        className="mx-auto max-w-3xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-primary/15 bg-primary/5 p-7 md:p-9 text-center"
        >
          <span className="text-sm font-medium text-primary mb-2 block">먼저 여기까지만</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            지금은 무료 체험만 확인하셔도 충분합니다
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            가입 없이 3개 시나리오를 바로 체험하고, 더 필요할 때만 플랜을 검토하면 됩니다.
          </p>
          <a
            href={buildTrackedServiceUrl("trial-card")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("trial-card", SERVICE_URL)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            무료로 3개 시나리오 체험
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground/80">
            가입 없이 바로 시작 · 시나리오당 12턴 시뮬레이션 + 간략 리포트
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  {
    q: "AI 팀원이 정말 실제처럼 반응하나요?",
    a: "각 시나리오별로 성격, 감정 상태, 반응 패턴이 세밀하게 설계되어 있습니다. 신뢰도(0~100)와 6단계 감정 상태에 따라 한국 직장 문화의 뉘앙스(한숨, 침묵, 돌려 말하기 등)까지 자연스럽게 반응합니다.",
  },
  {
    q: "한 번 연습에 얼마나 걸리나요?",
    a: "보통 한 시나리오당 15~30분 정도 소요됩니다. 무료 체험은 시나리오당 12턴으로 구성돼 짧은 시간에 핵심적인 면담 연습을 할 수 있도록 설계되어 있습니다.",
  },
  {
    q: "대화 데이터는 어떻게 처리되나요?",
    a: "대화 데이터는 리포트 생성과 서비스 운영 목적에 맞춰 필요한 범위에서 처리됩니다. 실제 인사평가 정보, 민감한 개인정보, 제3자의 식별 가능한 정보는 입력하지 않는 것을 권장합니다.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-3xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <span className="text-sm font-medium text-primary mb-2 block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            자주 묻는 질문
          </h2>
        </motion.div>

        <motion.div variants={stagger} className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="rounded-xl border border-border bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-foreground pr-4">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA({ buildTrackedServiceUrl, trackCtaClick }: Pick<CtaContext, "buildTrackedServiceUrl" | "trackCtaClick">) {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div
          variants={fadeUp}
          className="rounded-3xl bg-gradient-to-br from-primary via-primary to-indigo-dark p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로, 첫 번째 대화를 시작하세요
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              3개 시나리오를 무료로 체험할 수 있습니다. 가입 없이 바로 시작해보세요.
            </p>
            <a
              href={buildTrackedServiceUrl("final-cta")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("final-cta", SERVICE_URL)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-primary hover:bg-white/90 transition-colors shadow-lg"
            >
              무료 체험 시작
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer({ buildTrackedServiceUrl, trackCtaClick }: Pick<CtaContext, "buildTrackedServiceUrl" | "trackCtaClick">) {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px]">
            L
          </span>
          Letmefree
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a
            href={buildTrackedServiceUrl("footer-service-link")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("footer-service-link", SERVICE_URL)}
            className="hover:text-foreground transition-colors"
          >
            서비스 바로가기
          </a>
          <span>|</span>
          <span>&copy; {new Date().getFullYear()} Humanistic. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Export ─── */
export default function LandingContent() {
  const [attribution, setAttribution] = useState<AttributionParams>(() => readAttribution(""));

  const variant = attribution.lp;

  // Mount 시 1회만: URL 기반 attribution 채움 + landing_variant_view 단일 발사.
  // attribution을 한 번에 final 값으로 갱신해 변경 의존 useEffect 재발사를 회피.
  useEffect(() => {
    const next = readAttribution(window.location.search);
    setAttribution(next);
    trackEvent("landing_variant_view", {
      variant: next.lp,
      ...next,
      path: window.location.pathname,
    });
  }, []);

  const buildTrackedServiceUrl = (placement: string) => buildServiceUrl(attribution, placement);
  const buildTrackedLoginUrl = (placement: string) => buildLoginUrl(attribution, placement);

  const trackCtaClick = (placement: string, target: string) => {
    trackEvent("cta_click", {
      variant,
      placement,
      target,
      ...attribution,
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ scrollBehavior: "smooth" }}>
      <Nav buildTrackedServiceUrl={buildTrackedServiceUrl} buildTrackedLoginUrl={buildTrackedLoginUrl} trackCtaClick={trackCtaClick} />
      <Hero variant={variant} buildTrackedServiceUrl={buildTrackedServiceUrl} trackCtaClick={trackCtaClick} />
      <ProblemSection variant={variant} />
      <SolutionSection />
      <EmotionJourneySection />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoPreview buildTrackedServiceUrl={buildTrackedServiceUrl} trackCtaClick={trackCtaClick} />
      <EvidenceSection />
      <TrialCard buildTrackedServiceUrl={buildTrackedServiceUrl} trackCtaClick={trackCtaClick} />
      <FAQSection />
      <FinalCTA buildTrackedServiceUrl={buildTrackedServiceUrl} trackCtaClick={trackCtaClick} />
      <Footer buildTrackedServiceUrl={buildTrackedServiceUrl} trackCtaClick={trackCtaClick} />
    </div>
  );
}
