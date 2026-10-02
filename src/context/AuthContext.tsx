import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { DEMO_USERS } from '@/data';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const roleLabels: Record<UserRole, string> = {
  owner: 'Factory Owner',
  tech: 'Maintenance Technician',
  admin: 'Cluster Admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    for (const key of Object.keys(DEMO_USERS) as UserRole[]) {
      const demo = DEMO_USERS[key];
      if (demo.email === email && demo.password === password) {
        setUser({ email: demo.email, role: demo.role, name: demo.name });
        return true;
      }
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser({ email: demo.email, role: demo.role, name: demo.name });
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser({ email: demo.email, role: demo.role, name: demo.name });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAsRole, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { roleLabels };
