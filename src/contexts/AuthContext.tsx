import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import type {
  AcceptInviteUser,
  LoginUser,
  SignupUser,
  User,
} from "../type/user";
import { getAuthUser, login, signup, acceptInvite } from "../api/auth";

type AuthContextType = {
  user?: User | null;
  isLoading?: boolean;
  signupUser: (user: SignupUser) => Promise<ApiResponse>;
  loginUser: (user: LoginUser) => Promise<ApiResponse>;
  logoutUser: () => void;
  acceptInviteUser: (user: AcceptInviteUser) => Promise<ApiResponse>;
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
  acceptInviteUser: async () => {
    return Promise.resolve({} as ApiResponse);
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

  const acceptInviteUser = useCallback(async (data: AcceptInviteUser) => {
    const res = await acceptInvite(data);

    if (res.success && res.data) {
      localStorage.setItem("jwt", res.data.token);
      setUser(res.data.user);
    }
    return res;
  }, []);

  const value = useMemo(
    () => ({
      signupUser,
      loginUser,
      logoutUser,
      acceptInviteUser,
      user,
      isLoading,
    }),
    [signupUser, loginUser, logoutUser, acceptInviteUser, user, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
