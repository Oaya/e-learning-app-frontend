import axios from "axios";
import type { InviteUser, UpdateStudentData } from "../type/user";

import type { UserQueryInput } from "../features/admin/students/hooks/useUsers";
import { authHeader } from "./auth";

export async function getStudents({
  filters,
  search,
  sorts,
}: UserQueryInput): Promise<ApiResponse> {
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

    const url: string = `${import.meta.env.VITE_API_URL}/api/users?${params.toString()}`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getStudentsWithStatues(): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/with_statues`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getStudentById(id: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${id}`;
    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function inviteUser(
  data: InviteUser | InviteUser[],
): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/auth/invitation`;

    const payload = { users: Array.isArray(data) ? data : [data] };
    const response = await axios.post(url, payload, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateStudent(
  id: string,
  data: UpdateStudentData,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/${id}`;
    const res = await axios.patch(url, data, {
      headers: authHeader(),
    });

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function deleteStudent(userId: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${userId}`;
    const response = await axios.delete(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
