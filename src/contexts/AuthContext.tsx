import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import type { LoginUser, SignupUser, User } from "../type/auth";
import { getAuthUser, login, signup } from "../api/auth";

type AuthContextType = {
  user?: User | null;
  isLoading?: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getAuthUser();
        setUser(res.data);
      } catch (err) {
        console.log(err);
        localStorage.removeItem("jwt");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
    () => ({ signupUser, loginUser, logoutUser, user, isLoading }),
    [signupUser, loginUser, logoutUser, user, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
