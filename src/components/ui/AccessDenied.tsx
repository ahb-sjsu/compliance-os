import { useAuth } from '../../auth/useAuth';

export function AccessDenied() {
  const { user, signOut } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg)',
        fontFamily: '"Instrument Sans", sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>ComplianceOS</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#dc2626', marginBottom: 12 }}>Access Denied</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
          Your account (<strong>{user?.email}</strong>) has not been authorized to use this application.
          <br />
          Please contact your administrator to request access.
        </div>
        <button
          className="btn bs"
          onClick={signOut}
          style={{ fontSize: 13, padding: '10px 24px', borderRadius: 8 }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
