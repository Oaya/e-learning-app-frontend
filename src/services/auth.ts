import axios from "axios";
import type { LoginUser, SignupUser } from "../type/auth";

export async function signup(data: SignupUser): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth`;
    const response = await axios.post(url, data);

    console.log("Signup response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function login(data: LoginUser): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/sign_in`;
    const response = await axios.post(url, data);

    console.log("Login response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
