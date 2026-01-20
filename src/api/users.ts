import axios from "axios";
import type { InviteUser, User } from "../type/user";

export async function getUsers(): Promise<User[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get users response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function inviteUser(data: InviteUser): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/invitation`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Invite user response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
