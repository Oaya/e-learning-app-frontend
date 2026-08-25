import axios from "axios";
import type {
  AcceptInviteUser,
  LoginUser,
  SignupUser,
  UpdatePassword,
  UpdatePolicy,
  UpdateUser,
} from "@/type/user";
import { directUploadToActiveStorage } from "./files";

export const authHeader = () => {
  const token = localStorage.getItem("jwt");

  if (!token) return { success: false, error: "No token" };
  return { Authorization: `Bearer ${token}` };
};

export async function signup(data: SignupUser): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth`;
    const response = await axios.post(url, data);
    console.log("Signup response:", response);

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getTenantSubscriptionData(
  lessonId: string,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/auth/tenant_subscription/${lessonId}`;
    const res = await axios.get(url);

    console.log("Tenant subscription status response:", res);

    return { success: true, data: res.data };
  } catch (e: any) {
    return {
      success: false,
      error:
        e.response?.data?.error || "Failed to get tenant subscription status",
    };
  }
}

export async function login(data: LoginUser): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/sign_in`;
    const response = await axios.post(url, data);

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getAuthUser(): Promise<ApiResponse> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: authHeader(),
    });

    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function acceptInvite(
  data: AcceptInviteUser,
): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/invitation`;
    const response = await axios.patch(url, { api_user: data });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateUserData(data: UpdateUser): Promise<ApiResponse> {
  try {
    const updatePayload: Record<string, any> = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      timezone: data.timezone,
    };

    // Replace avatar
    if (data.avatar instanceof File) {
      updatePayload.avatar_signed_id = await directUploadToActiveStorage(
        data.avatar,
        "avatars",
      );
    }

    // Remove avatar
    if (data.avatar === null) {
      updatePayload.avatar_signed_id = "";
    }

    const url = `${import.meta.env.VITE_API_URL}/api/auth/me`;
    const res = await axios.patch(url, updatePayload, {
      headers: authHeader(),
    });

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateCancellationPolicy(
  data: UpdatePolicy,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/auth/me`;
    const res = await axios.patch(url, data, { headers: authHeader() });
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/password`,
      { email },
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function resetPassword(data: {
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<ApiResponse> {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/password`,
      {
        reset_password_token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateUserPassword(
  data: UpdatePassword,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/auth/me/password`;
    const res = await axios.patch(url, data, {
      headers: authHeader(),
    });

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
