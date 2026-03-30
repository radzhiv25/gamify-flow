import type { ComponentType } from "react";
import { HiGiftTop } from "react-icons/hi2";
import { BiSolidDiscount, BiSolidCrown } from "react-icons/bi";

type Feature = {
  /** Works with react-icons (`IconType`) and other SVG icon components */
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    Icon: HiGiftTop,
    title: "Reward Your Ambassadors",
    description: "Boost campaign performance by setting up rewards for ambassadors",
  },
  {
    Icon: BiSolidCrown,
    title: "Set Milestones",
    description: "Set up custom goals for sales, posts, or time-based achievements",
  },
  {
    Icon: BiSolidDiscount,
    title: "Customise Incentives",
    description:
      "Create custom incentives like flat fees, free products, or special commissions.",
  },
];

function FeatureCardWaves() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[140px] overflow-hidden text-primary-color/20"
      aria-hidden
    >
      <svg
        className="absolute left-1/2 top-0 h-[120px] w-[200%] -translate-x-1/2"
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <path
          d="M0 40 Q200 10 400 40 T800 40"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.35"
        />
        <path
          d="M0 65 Q200 35 400 65 T800 65"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.28"
        />
        <path
          d="M0 90 Q200 60 400 90 T800 90"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.22"
        />
        <path
          d="M0 115 Q200 85 400 115 T800 115"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.16"
        />
        <path
          d="M0 140 Q200 110 400 140 T800 140"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.12"
        />
      </svg>
    </div>
  );
}

function FeatureCard({ Icon, title, description }: Feature) {
  return (
    <article className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-primary-color-lightest bg-white px-5 pb-7 pt-10 text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
      <FeatureCardWaves />

      <div className="relative z-[1] mb-4 flex size-12 items-center justify-center rounded-lg outline-6 outline-primary-color-light">
        <Icon className="size-6 text-primary-color-dark" />
      </div>

      <h3 className="relative z-[1] text-base font-medium text-primary-color-dark">
        {title}
      </h3>
      <p className="relative z-[1] mt-2 text-sm font-normal leading-5 text-text-grey">
        {description}
      </p>
    </article>
  );
}

/** Three feature cards; overlaps the bottom of the hero frame like Figma */
export function GamificationFeatureCards() {
  return (
    <div className="relative z-20 -mt-16 grid w-full grid-cols-1 gap-6 px-1 md:-mt-[72px] md:grid-cols-3 md:gap-5">
      {FEATURES.map((f) => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </div>
  );
}
