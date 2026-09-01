import axios from "axios";
import type { InviteUser, UpdateStudentData } from "@/type/user";
import { authHeader } from "./auth";

export async function getStudents(): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/`;

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
