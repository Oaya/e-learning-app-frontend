import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Signup } from "../type/auth";
import { signup } from "../services/auth";

type AuthContextType = {
  signupUser: (userData: Signup) => Promise<ApiResponse>;
};

const AuthContext = createContext<AuthContextType>({
  signupUser: async () => {
    return Promise.resolve({} as ApiResponse);
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const signupUser = useCallback(async (data: Signup) => {
    return await signup(data);
  }, []);

  const value = useMemo(() => ({ signupUser }), [signupUser]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
