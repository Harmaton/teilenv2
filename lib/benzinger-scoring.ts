export type BenzingerQuadrant = "RB" | "LB" | "RF" | "LF";

export type BenzingerItem = {
  id: string;
  scoring?: {
    quadrant: BenzingerQuadrant;
    pointsByOption?: Record<string, number>;
    maxPoints?: number;
  };
};

export type BenzingerScores = {
  raw: Record<BenzingerQuadrant, number>;
  percentages: Record<BenzingerQuadrant, number>;
};

const QUADRANTS: BenzingerQuadrant[] = ["RB", "LB", "RF", "LF"];

/**
 * Scores one completed attempt from the approved question-level key.
 * The question key belongs to the test snapshot, never to the prompt or UI.
 */
export function calculateBenzingerScores(
  items: BenzingerItem[],
  answers: Record<string, unknown>
): BenzingerScores {
  const raw = emptyScores();

  for (const item of items) {
    const scoring = item.scoring;
    if (!scoring || !QUADRANTS.includes(scoring.quadrant)) continue;

    const answer = answers[item.id];
    const answerKey = typeof answer === "string" ? answer : String(answer ?? "");
    const points = scoring.pointsByOption?.[answerKey] ?? 0;
    raw[scoring.quadrant] += Math.max(0, points);
  }

  const percentages = emptyScores();
  for (const quadrant of QUADRANTS) {
    percentages[quadrant] = Math.min(100, Math.round(raw[quadrant] * 5));
  }

  return { raw, percentages };
}

function emptyScores(): Record<BenzingerQuadrant, number> {
  return { RB: 0, LB: 0, RF: 0, LF: 0 };
}
