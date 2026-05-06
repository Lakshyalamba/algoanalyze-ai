import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
  type User,
} from '../services/authApi';

const tokenStorageKey = 'algoanalyze_token';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenStorageKey));
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(tokenStorageKey, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(tokenStorageKey);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(tokenStorageKey);

    if (!storedToken) {
      clearSession();
      setIsLoading(false);
      return;
    }

    try {
      const result = await getCurrentUser(storedToken);
      setToken(storedToken);
      setUser(result.user);
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser({ email, password });
      persistSession(result.token, result.user);
    },
    [persistSession],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await signupUser({ name, email, password });
      persistSession(result.token, result.user);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser(token);
    } finally {
      clearSession();
    }
  }, [clearSession, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, signup, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
