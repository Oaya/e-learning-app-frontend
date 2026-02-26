import axios from "axios";
import type { Instructor, InviteUser, User } from "../type/user";
import type { Course } from "../type/course";
import type { UserQueryInput } from "../hooks/useUsers";

export async function getUsers({ filters }: UserQueryInput): Promise<User[]> {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, values]) => {
        if (key && values.length > 0) {
          params.append(key, values.join(","));
        }
      });
    }

    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users?${params.toString()}`;

    console.log(url);
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

export async function deleteUsers(userIds: string[]): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/bulk_delete`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { user_ids: userIds },
    });

    console.log("Delete users response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/instructors`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get instructors response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getUserCourses(userId: string): Promise<Course[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${userId}/courses`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get user courses response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
