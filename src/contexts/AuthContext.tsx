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
  user?: User | null;
  signupUser: (user: SignupUser) => Promise<ApiResponse>;
  loginUser: (user: LoginUser) => Promise<ApiResponse>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signupUser: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  loginUser: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  logoutUser() {
    return;
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

  const logoutUser = useCallback(async () => {
    localStorage.removeItem("jwt");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ signupUser, loginUser, logoutUser, user }),
    [signupUser, loginUser, logoutUser, user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
