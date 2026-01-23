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
import {
  getAuthUser,
  login,
  signup,
  acceptInvite,
  updateUserData,
} from "../api/auth";

type AuthContextType = {
  user?: User | null;
  isLoading?: boolean;
  signupUser: (user: SignupUser) => Promise<ApiResponse>;
  loginUser: (user: LoginUser) => Promise<ApiResponse>;
  logoutUser: () => void;
  acceptInviteUser: (user: AcceptInviteUser) => Promise<ApiResponse>;
  updateUser: (user: FormData) => Promise<ApiResponse>;
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
  updateUser: async () => {
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
    setIsLoading(true);

    const res = await signup(data);

    setIsLoading(false);
    return res;
  }, []);

  const loginUser = useCallback(
    async (data: LoginUser): Promise<ApiResponse> => {
      setIsLoading(true);

      const res = await login(data);
      if (res.success && res.data?.user && res.data?.token) {
        localStorage.setItem("jwt", res.data.token);
        setUser(res.data.user as User);
      }

      setIsLoading(false);
      return res;
    },
    [],
  );

  const logoutUser = useCallback(async () => {
    localStorage.removeItem("jwt");
    setUser(null);
  }, []);

  const acceptInviteUser = useCallback(async (data: AcceptInviteUser) => {
    setIsLoading(true);
    const res = await acceptInvite(data);

    if (res.success && res.data) {
      localStorage.setItem("jwt", res.data.token);
      setUser(res.data.user);
    }
    setIsLoading(false);
    return res;
  }, []);

  const updateUser = useCallback(async (data: FormData) => {
    setIsLoading(true);
    const res = await updateUserData(data);
    if (res.success && res.data) {
      setUser(res.data);
    }
    setIsLoading(false);
    return res;
  }, []);

  const value = useMemo(
    () => ({
      signupUser,
      loginUser,
      logoutUser,
      acceptInviteUser,
      updateUser,
      user,
      isLoading,
    }),
    [
      signupUser,
      loginUser,
      logoutUser,
      acceptInviteUser,
      updateUser,
      user,
      isLoading,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
