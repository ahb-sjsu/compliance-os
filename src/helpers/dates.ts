export function nowTs(): string {
  return new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function daysUntil(d: string): number | null {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - new Date().getTime()) / 86400000);
}

export function fmtDays(d: number | null): string {
  if (d === null) return 'No expiry';
  if (d < 0) return 'EXPIRED ' + Math.abs(d) + 'd ago';
  if (d === 0) return 'Expires today';
  return 'Expires in ' + d + 'd';
}
