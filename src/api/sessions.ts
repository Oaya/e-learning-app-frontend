import axios from "axios";
import type { CreateSession } from "../type/session";

export async function createSession(data: CreateSession): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sessions`;

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create Session response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
