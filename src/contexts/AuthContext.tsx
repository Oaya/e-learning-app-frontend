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
  UpdatePassword,
  UpdatePolicy,
  UpdateUser,
  User,
} from "@/type/user";
import {
  getAuthUser,
  login,
  signup,
  acceptInvite,
  updateUserData,
  updateUserPassword,
  updateCancellationPolicy,
} from "@/api/auth";
import { cancelSubscription, changePlan } from "@/api/subscription";

type AuthContextType = {
  user?: User | null;
  isLoading?: boolean;
  isAuthLoading?: boolean;
  signupUser: (user: SignupUser) => Promise<ApiResponse>;
  loginUser: (user: LoginUser) => Promise<ApiResponse>;
  logoutUser: () => void;
  acceptInviteUser: (user: AcceptInviteUser) => Promise<ApiResponse>;
  updateUser: (user: UpdateUser) => Promise<ApiResponse>;
  updatePassword: (data: UpdatePassword) => Promise<ApiResponse>;
  cancelSubscriptionPlan: () => Promise<ApiResponse>;
  changeSubscriptionPlan: (plan: string) => Promise<ApiResponse>;
  updatePolicy: (user: UpdatePolicy) => Promise<ApiResponse>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
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
  updatePassword: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  cancelSubscriptionPlan: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  changeSubscriptionPlan: async () => {
    return Promise.resolve({} as ApiResponse);
  },
  updatePolicy: async () => {
    return Promise.resolve({} as ApiResponse);
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Gates initial auth bootstrap only (checked by RequireAuth). Separate from
  // isLoading below, which tracks in-flight mutations (profile/avatar saves,
  // password updates, etc.) so those don't blank out the routed app.
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setIsAuthLoading(false);
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
        setIsAuthLoading(false);
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

  const updateUser = useCallback(async (data: UpdateUser) => {
    setIsLoading(true);
    const res = await updateUserData(data);
    if (res.success && res.data) {
      setUser(res.data);
    }
    setIsLoading(false);
    return res;
  }, []);

  const updatePassword = useCallback(async (data: UpdatePassword) => {
    setIsLoading(true);
    const res = await updateUserPassword(data);

    setIsLoading(false);
    return res;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userRes = await getAuthUser();
      setUser(userRes.data);
    } catch (err) {
      console.log("Error refreshing user:", err);
    }
  }, []);

  const cancelSubscriptionPlan = useCallback(async () => {
    setIsLoading(true);
    const res = await cancelSubscription();

    if (res.success) {
      await refreshUser();
    }
    setIsLoading(false);
    return res;
  }, [refreshUser]);

  const changeSubscriptionPlan = useCallback(
    async (plan: string) => {
      setIsLoading(true);
      const res = await changePlan(plan);

      if (res.success) {
        await refreshUser();
      }
      setIsLoading(false);
      return res;
    },
    [refreshUser],
  );

  const updatePolicy = useCallback(
    async (data: UpdatePolicy) => {
      setIsLoading(true);
      const res = await updateCancellationPolicy(data);
      if (res.success) {
        await refreshUser();
      }
      setIsLoading(false);
      return res;
    },
    [refreshUser],
  );

  const value = useMemo(
    () => ({
      signupUser,
      loginUser,
      logoutUser,
      acceptInviteUser,
      updateUser,
      updatePassword,
      cancelSubscriptionPlan,
      changeSubscriptionPlan,
      updatePolicy,
      user,
      isLoading,
      isAuthLoading,
    }),
    [
      signupUser,
      loginUser,
      logoutUser,
      acceptInviteUser,
      updateUser,
      updatePassword,
      cancelSubscriptionPlan,
      changeSubscriptionPlan,
      updatePolicy,
      user,
      isLoading,
      isAuthLoading,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
