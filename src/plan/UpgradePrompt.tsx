import { PLANS } from './plans';

interface UpgradePromptProps {
  feature: string;
  inline?: boolean;
}

export function UpgradePrompt({ feature, inline }: UpgradePromptProps) {
  const pro = PLANS.pro;
  if (inline) {
    return (
      <span
        style={{
          fontSize: 11,
          color: 'var(--text3)',
          fontFamily: '"JetBrains Mono",monospace',
        }}
      >
        PRO
      </span>
    );
  }
  return (
    <div
      style={{
        background: 'rgba(255,255,255,.06)',
        border: '1px solid rgba(255,255,255,.15)',
        borderRadius: 10,
        padding: '20px 24px',
        textAlign: 'center',
        maxWidth: 420,
        margin: '24px auto',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: '#fbbf24',
          marginBottom: 8,
          fontFamily: '"JetBrains Mono",monospace',
        }}
      >
        PRO FEATURE
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{feature}</div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--text2)',
          lineHeight: 1.5,
          marginBottom: 14,
        }}
      >
        Upgrade to <strong>ComplianceOS Pro</strong> ({pro.price}) for unlimited vendors, exports, framework compliance,
        risk assessments, and more.
      </div>
      <button
        className="btn bp bsm"
        onClick={() =>
          alert(
            'In production, this opens Stripe Checkout or your payment flow.\n\nFor now, you can toggle to Pro in Settings > Plan.',
          )
        }
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
