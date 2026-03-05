import { useAuth } from './auth/useAuth';
import { LoginPage } from './auth/LoginPage';
import { UsersProvider } from './users/UsersContext';
import { useUsers } from './users/useUsers';
import { PlanProvider } from './plan/PlanContext';
import { SettingsProvider } from './settings/SettingsContext';
import { StorageContextProvider } from './storage/StorageContext';
import { AccessDenied } from './components/ui/AccessDenied';
import { App } from './App';

function RegistrationGate() {
  const { isRegistered } = useUsers();

  if (!isRegistered) {
    return <AccessDenied />;
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

export function AuthGate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <UsersProvider>
      <RegistrationGate />
    </UsersProvider>
  );
}
