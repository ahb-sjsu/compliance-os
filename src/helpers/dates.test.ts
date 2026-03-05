import { describe, it, expect } from 'vitest';
import { nowTs, daysUntil, fmtDays } from './dates';

describe('nowTs', () => {
  it('returns a non-empty string', () => {
    expect(nowTs()).toBeTruthy();
    expect(typeof nowTs()).toBe('string');
  });
});

describe('daysUntil', () => {
  it('returns null for empty string', () => {
    expect(daysUntil('')).toBeNull();
  });

  it('returns 0 for today', () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = daysUntil(today);
    expect(result).toBeLessThanOrEqual(1);
    expect(result).toBeGreaterThanOrEqual(-1);
  });

  it('returns positive number for future date', () => {
    const future = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const result = daysUntil(future);
    expect(result).toBeGreaterThan(28);
    expect(result).toBeLessThanOrEqual(31);
  });

  it('returns negative number for past date', () => {
    const past = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
    const result = daysUntil(past);
    expect(result).toBeLessThan(0);
  });
});

describe('fmtDays', () => {
  it('returns "No expiry" for null', () => {
    expect(fmtDays(null)).toBe('No expiry');
  });

  it('returns "Expires today" for 0', () => {
    expect(fmtDays(0)).toBe('Expires today');
  });

  it('returns "Expires in Xd" for positive', () => {
    expect(fmtDays(30)).toBe('Expires in 30d');
  });

  it('returns "EXPIRED Xd ago" for negative', () => {
    expect(fmtDays(-5)).toBe('EXPIRED 5d ago');
  });
});
