interface StatCardProps {
  cls: string;
  label: string;
  value: number;
  sub: string;
}

export function StatCard({ cls, label, value, sub }: StatCardProps) {
  return (
    <div className={'sc ' + cls}>
      <div className="sl">{label}</div>
      <div className="sv">{value}</div>
      <div className="ss">{sub}</div>
    </div>
  );
}
