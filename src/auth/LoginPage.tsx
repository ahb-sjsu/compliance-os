import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './useAuth';
import type { AuthUser } from './context';

export function LoginPage({ onSkip }: { onSkip: () => void }) {
  const { setAuth } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        const user: AuthUser = {
          name: info.name || info.email,
          email: info.email,
          picture: info.picture || '',
        };
        setAuth(tokenResponse.access_token, user);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    },
    onError: (err) => console.error('Google login failed:', err),
    scope: 'openid email profile https://www.googleapis.com/auth/drive.appdata',
  });

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
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 32, lineHeight: 1.6 }}>
          Vendor compliance management for small businesses.
          <br />
          Sign in with Google to sync your data across devices.
        </div>

        <button
          className="btn bp"
          onClick={() => login()}
          style={{ padding: '12px 24px', fontSize: 14, borderRadius: 8, marginBottom: 16 }}
        >
          Sign in with Google
        </button>

        <div>
          <button className="btn bs" onClick={onSkip} style={{ fontSize: 12 }}>
            Continue without signing in
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 24, lineHeight: 1.5 }}>
          Your data stays in your Google Drive.
          <br />
          No account required — local storage works too.
        </div>
      </div>
    </div>
  );
}
