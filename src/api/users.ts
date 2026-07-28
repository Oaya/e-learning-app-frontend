import axios from "axios";
import type { InviteUser, User, UserWithStatues } from "../type/user";

import type { UserQueryInput } from "../features/admin/students/hooks/useUsers";

export async function getUsers({
  filters,
  search,
  sorts,
}: UserQueryInput): Promise<User[]> {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, values]) => {
        if (key && values.length > 0) {
          params.append(key, values.join(","));
        }
      });
    }

    if (search) {
      params.append("search", search);
    }

    if (sorts) {
      const value = [];
      for (const sort of sorts) {
        value.push(sort.dir === "desc" ? `-${sort.field}` : sort.field);
      }

      if (value.length) params.append("sort", value.join(","));
    }

    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users?${params.toString()}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getUsersWithStatues(): Promise<UserWithStatues[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/with_statues`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getUser(id: string): Promise<User> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get user response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function inviteUser(
  data: InviteUser | InviteUser[],
): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/invitation`;

    const payload = { users: Array.isArray(data) ? data : [data] };
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Invite user response:", response);
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${userId}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete user response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
