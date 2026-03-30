const COLS = 12;
/** 5 rows: top + bottom half-height, three full rows → 4×80.5 = 322 */
const ROW_HEIGHTS = [40.25, 80.5, 80.5, 80.5, 40.25] as const;

const GRID_TEMPLATE_ROWS = ROW_HEIGHTS.map((h) => `${h}px`).join(" ");

/** 4 cols × 2 rows behind centered copy (1-based grid): cols 5–8, rows 3–4 */
function isCenterHighlightCell(col1: number, row1: number) {
  return col1 >= 5 && col1 <= 8 && row1 >= 3 && row1 <= 4;
}

/** Extra single-cell accents (1-based), aligned to grid */
const SCATTER_HIGHLIGHTS: ReadonlyArray<{ col: number; row: number; opacity: number }> = [
  { col: 1, row: 1, opacity: 0.35 },
  { col: 2, row: 2, opacity: 0.22 },
  { col: 12, row: 1, opacity: 0.28 },
  { col: 11, row: 3, opacity: 0.2 },
  { col: 3, row: 5, opacity: 0.25 },
  { col: 10, row: 5, opacity: 0.22 },
];

type HeroGridBackgroundProps = {
  className?: string;
};

/**
 * 12×5 grid (hero 960×322): rows 1 and 5 half-visible; rows 2–4 full height.
 * Pale purple 4×2 block behind the headline (cols 5–8, rows 3–4); inner grid lines hidden so it reads as one panel.
 */
export function HeroGridBackground({ className = "" }: HeroGridBackgroundProps) {
  const scatterKey = (c: number, r: number) => `${c}-${r}`;
  const scatterMap = new Map(SCATTER_HIGHLIGHTS.map((s) => [scatterKey(s.col, s.row), s.opacity]));

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-white ${className}`.trim()}
      aria-hidden
    >
      <div
        className="grid h-full w-full grid-cols-12"
        style={{ gridTemplateRows: GRID_TEMPLATE_ROWS }}
      >
        {Array.from({ length: COLS * ROW_HEIGHTS.length }, (_, i) => {
          const col1 = (i % COLS) + 1;
          const row1 = Math.floor(i / COLS) + 1;
          const center = isCenterHighlightCell(col1, row1);
          const scatter = scatterMap.get(scatterKey(col1, row1));

          const bg =
            center
              ? "bg-primary-color-lightest/70"
              : scatter
                ? "bg-primary-color-lightest"
                : "bg-white";

          const opacityStyle =
            scatter && !center ? { opacity: scatter } : undefined;

          // Hide grid borders around the center faded panel so it reads as one block.
          // Vertical: panel spans cols 5–8, so hide edges for cells whose right edge touches cols 5–8
          // (i.e. col1 in 4–8) within panel rows 3–4.
          const hideBorderR =
            row1 >= 3 && row1 <= 4 && col1 >= 4 && col1 <= 8;

          // Horizontal: panel spans rows 3–4, so hide edges for cells in rows 2–4
          // within cols 5–8.
          const hideBorderB = col1 >= 5 && col1 <= 8 && row1 >= 2 && row1 <= 4;

          const borderR = hideBorderR ? "border-r-0" : "border-r-[0.68px]";
          const borderB = hideBorderB ? "border-b-0" : "border-b-[0.68px]";

          return (
            <div
              key={i}
              className={[
                "box-border",
                bg,
                "border-[#E3E3E3]",
                col1 === 1 ? "border-l-[0.68px]" : "",
                row1 === 1 ? "border-t-[0.68px]" : "",
                borderR,
                borderB,
              ].join(" ")}
              style={opacityStyle}
            />
          );
        })}
      </div>
    </div>
  );
}
