import { useAuth } from './auth/useAuth';
import { LoginPage } from './auth/LoginPage';
import { PlanProvider } from './plan/PlanContext';
import { SettingsProvider } from './settings/SettingsContext';
import { StorageContextProvider } from './storage/StorageContext';
import { App } from './App';

export function AuthGate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <PlanProvider>
      <SettingsProvider>
        <StorageContextProvider>
          <App />
        </StorageContextProvider>
      </SettingsProvider>
    </PlanProvider>
  );
}
