import type { ReactNode } from 'react';

type AlertType = 'error' | 'warning' | 'info';

const CLS: Record<AlertType, string> = {
  error: 'al al-r',
  warning: 'al al-w',
  info: 'al al-i',
};

export function Alert({ type, children }: { type: AlertType; children: ReactNode }) {
  return <div className={CLS[type]}>{children}</div>;
}
