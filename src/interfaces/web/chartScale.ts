/**
 * Clean axis ticks for money charts. Returns ascending tick values (in
 * integer cents) from 0 to the first "nice" step at or past `maxCents`,
 * stepped on a 1 / 2 / 2.5 / 5 × 10^k grid. The step never drops below
 * 100 cents so every tick lands on a whole currency unit and can be
 * rendered with formatMoneyWhole.
 */
export function niceTicks(maxCents: number, targetCount = 4): number[] {
  const safeMax = Math.max(maxCents, 1);
  const rough = safeMax / targetCount;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const snapped =
    [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? 10 * pow;
  const step = Math.max(Math.round(snapped), 100);

  const count = Math.ceil(safeMax / step);
  const ticks: number[] = [];
  for (let i = 0; i <= count; i++) {
    ticks.push(i * step);
  }
  return ticks;
}
