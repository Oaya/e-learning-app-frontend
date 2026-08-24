import axios from "axios";
import type { GenerateHomeworkWithAI, UpsertHomework } from "@/type/homework";
import { authHeader } from "./auth";

export async function getHomeworks(studentId?: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks${
      studentId ? `?student_id=${studentId}` : ""
    }`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getHomework(id: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function createHomework(
  data: UpsertHomework,
): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks`;

    const response = await axios.post(url, data, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateHomework(
  id: string,
  data: UpsertHomework,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;
    const response = await axios.patch(url, data, {
      headers: authHeader(),
    });
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function generateHomework(
  data: GenerateHomeworkWithAI,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/homeworks/ai_generate`;
    const response = await axios.post(url, data, { headers: authHeader() });
    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function deleteHomework(id: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;

    const response = await axios.delete(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
