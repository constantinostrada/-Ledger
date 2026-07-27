import { describe, it, expect } from 'vitest';
import { niceTicks } from '@interfaces/web/chartScale';

describe('niceTicks', () => {
  it('steps on a nice grid and covers the max', () => {
    expect(niceTicks(123456)).toEqual([0, 50000, 100000, 150000]);
  });

  it('lands the top tick exactly on a round max', () => {
    expect(niceTicks(200000)).toEqual([0, 50000, 100000, 150000, 200000]);
  });

  it('never steps below a whole currency unit', () => {
    expect(niceTicks(250)).toEqual([0, 100, 200, 300]);
  });

  it('handles a zero max without collapsing', () => {
    expect(niceTicks(0)).toEqual([0, 100]);
  });

  it('uses the 2.5 step where it fits', () => {
    expect(niceTicks(1000000)).toEqual([0, 250000, 500000, 750000, 1000000]);
  });
});
