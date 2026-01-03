import axios from "axios";
import type { Signup } from "../type/auth";

export async function signup(data: Signup): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth`;
    const response = await axios.post(url, data);

    console.log("Signup response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
