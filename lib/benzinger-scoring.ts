export type BenzingerQuadrant = "RB" | "LB" | "RF" | "LF";

export type BenzingerItem = {
  id: string;
  options?: { id: string; text?: string }[];
  scoring?: {
    quadrant: BenzingerQuadrant;
    pointsByOption?: Record<string, number>;
    maxPoints?: number;
  };
};

export type BenzingerScores = {
  raw: Record<BenzingerQuadrant, number>;
  max: Record<BenzingerQuadrant, number>;
  percentages: Record<BenzingerQuadrant, number>;
};

const QUADRANTS: BenzingerQuadrant[] = ["RB", "LB", "RF", "LF"];

export const BENZINGER_QUADRANT_LABELS: Record<BenzingerQuadrant, string> = {
  RB: "RB — Basal derecho",
  LB: "LB — Basal izquierdo",
  RF: "RF — Frontal derecho",
  LF: "LF — Frontal izquierdo",
};

/**
 * Scores one completed attempt from the approved question-level key.
 * The question key belongs to the test snapshot, never to the prompt or UI.
 */
export function calculateBenzingerScores(
  items: BenzingerItem[],
  answers: Record<string, unknown>
): BenzingerScores {
  const raw = emptyScores();
  const possible = emptyScores();

  for (const item of items) {
    const scoring = item.scoring;
    if (!scoring || !QUADRANTS.includes(scoring.quadrant)) continue;

    const answer = answers[item.id];
    const answerKey = typeof answer === "string" ? answer : String(answer ?? "");
    const points = scoring.pointsByOption?.[answerKey] ?? 0;
    raw[scoring.quadrant] += Math.max(0, points);
    possible[scoring.quadrant] += Math.max(
      0,
      scoring.maxPoints ?? Math.max(0, ...Object.values(scoring.pointsByOption ?? {})),
    );
  }

  const percentages = emptyScores();
  for (const quadrant of QUADRANTS) {
    percentages[quadrant] = possible[quadrant]
      ? Math.min(100, Math.round((raw[quadrant] / possible[quadrant]) * 100))
      : 0;
  }

  return { raw, max: possible, percentages };
}

function emptyScores(): Record<BenzingerQuadrant, number> {
  return { RB: 0, LB: 0, RF: 0, LF: 0 };
}
