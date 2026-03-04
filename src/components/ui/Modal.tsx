import type { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  xl?: boolean;
}

export function Modal({ onClose, title, subtitle, children, footer, xl }: ModalProps) {
  return (
    <div className="ov" onClick={onClose}>
      <div className={'mo' + (xl ? ' mo-xl' : '')} onClick={(e) => e.stopPropagation()}>
        <div className="mo-hd">
          <div>
            <div className="mo-ti">{title}</div>
            {subtitle && <div className="mo-su">{subtitle}</div>}
          </div>
          <button className="mo-cl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mo-bd">{children}</div>
        {footer && <div className="mo-ft">{footer}</div>}
      </div>
    </div>
  );
}
