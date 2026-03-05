import { describe, it, expect } from 'vitest';
import { FW } from './frameworks';

describe('FW framework definitions', () => {
  const EXPECTED_FW = ['CJIS', 'FedRAMP', 'StateRAMP', 'CISA'];

  it('defines all four frameworks', () => {
    expect(Object.keys(FW)).toEqual(expect.arrayContaining(EXPECTED_FW));
  });

  for (const fwId of EXPECTED_FW) {
    describe(fwId, () => {
      it('has required metadata', () => {
        const fw = FW[fwId];
        expect(fw.id).toBe(fwId);
        expect(fw.label).toBeTruthy();
        expect(fw.full).toBeTruthy();
        expect(fw.src).toMatch(/^https:\/\//);
      });

      it('has at least 5 controls', () => {
        expect(FW[fwId].controls.length).toBeGreaterThanOrEqual(5);
      });

      it('controls have unique IDs', () => {
        const ids = FW[fwId].controls.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('controls have required fields', () => {
        for (const ctrl of FW[fwId].controls) {
          expect(ctrl.id).toBeTruthy();
          expect(ctrl.sec).toBeTruthy();
          expect(ctrl.label).toBeTruthy();
        }
      });
    });
  }
});
