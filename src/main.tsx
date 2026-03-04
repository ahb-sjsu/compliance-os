import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './auth/AuthContext';
import { SettingsProvider } from './settings/SettingsContext';
import { StorageContextProvider } from './storage/StorageContext';
import { PlanProvider } from './plan/PlanContext';
import { App } from './App';
import './assets/styles/index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <PlanProvider>
          <SettingsProvider>
            <StorageContextProvider>
              <App />
            </StorageContextProvider>
          </SettingsProvider>
        </PlanProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
