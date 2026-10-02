import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
