import axios from "axios";
import type {
  AcceptInviteUser,
  LoginUser,
  SignupUser,
  UpdateUser,
} from "../type/user";
import { directUploadToActiveStorage } from "./files";

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

export async function login(data: LoginUser): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/sign_in`;
    const response = await axios.post(url, data);

    console.log("Login response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getAuthUser(): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return { success: false, error: "No token" };
    }

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get Auth User response:", res);

    return { success: true, data: res.data };
  } catch (err: any) {
    console.log("Error in getAuthUser:", err);
    return { success: false, error: err.response?.data?.error };
  }
}

export async function acceptInvite(
  data: AcceptInviteUser,
): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/invitation`;
    const response = await axios.patch(url, { api_user: data });

    console.log("Accept invite user response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateUserData(data: UpdateUser): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) return { success: false, error: "No token" };

    const updatePayload: Record<string, any> = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };

    // Replace avatar
    if (data.avatar instanceof File) {
      updatePayload.avatar_signed_id = await directUploadToActiveStorage(
        data.avatar,
        "avatar",
      );
    }

    // Remove avatar
    if (data.avatar === null) {
      updatePayload.avatar_signed_id = "";
    }

    console.log("Update payload:", updatePayload);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      updatePayload,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
