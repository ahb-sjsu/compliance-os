import type { ReactNode } from 'react';

interface TopbarProps {
  title: string;
  actions?: ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="topbar np">
      <div className="tb-title">{title}</div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </header>
  );
}
