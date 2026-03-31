import { HeroGridBackground } from "./HeroGridBackground";
import { GamificationFeatureCards } from "./GamificationFeatureCards";
import { CreateRewardSystemDialog } from "./create-reward-dialog";
import { Button } from "@/components/ui/button";

/**
 * Hero frame: Figma 960×322, radius 16, border #E3E3E3 (0.68px).
 * Grid is a separate layer; copy + CTA sit above it.
 * Feature cards overlap the bottom of the hero like Figma.
 */
export function GamificationHero() {
  return (
    <section className="w-full pb-12 pt-4 md:pt-6">
      <div className="relative mx-auto w-full">
        <div className="relative h-[322px] w-full overflow-hidden rounded-2xl border-[0.68px] border-[#E3E3E3] bg-white">
          <HeroGridBackground />

          <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            {/** Width matches grid columns 5–8: 4 × 80px = 320px; re-enable hits for CTA */}
            <div className="pointer-events-auto flex w-full max-w-[320px] flex-col items-center">
              <h1 className="mb-2 text-3xl font-semibold leading-tight tracking-tight text-primary-color-darkest md:mb-3 md:leading-[1.05]">
                Gamify your Campaign
              </h1>
              <p className="mb-2 max-w-[360px] text-sm font-normal leading-5 text-text-grey-light md:mb-8 md:text-[16px]">
                Enable gamification to start crafting your custom reward system.
              </p>
              <CreateRewardSystemDialog>
                <Button
                  type="button"
                  className="w-full max-w-[310px] rounded-10 bg-primary-color px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 active:opacity-90 md:py-2.5 md:text-base cursor-pointer"
                >
                  Enable Gamification
                </Button>
              </CreateRewardSystemDialog>
            </div>
          </div>
        </div>
        <div className="px-4">
          <GamificationFeatureCards />
        </div>
      </div>
    </section>
  );
}
