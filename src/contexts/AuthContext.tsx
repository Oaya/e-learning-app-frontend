import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
  useState,
} from "react";
import type { LoginUser, SignupUser, User } from "../type/auth";
import { login, signup } from "../api/auth";

type AuthContextType = {
  signupUser: (user: SignupUser) => Promise<ApiResponse>;
  loginUser: (user: LoginUser) => Promise<ApiResponse>;
};

const AuthContext = createContext<AuthContextType>({
  signupUser: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  loginUser: async () => {
    return Promise.resolve({} as ApiResponse);
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const signupUser = useCallback(async (data: SignupUser) => {
    return await signup(data);
  }, []);

  const loginUser = useCallback(async (data: LoginUser) => {
    const res = await login(data);
    console.log(res);

    if (res.success && res.data.user) {
      localStorage.setItem("jwt", res.data.token);
      setUser(res.data.user as User);
    }
    return res;
  }, []);

  const value = useMemo(
    () => ({ signupUser, loginUser, user }),
    [signupUser, loginUser, user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
