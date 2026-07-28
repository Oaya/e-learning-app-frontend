import axios from "axios";
import type { UpsertLesson } from "../type/lesson";

export async function createLesson(data: UpsertLesson): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons`;

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function deleteLesson(id: string): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function cancelLesson(id: string): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}/cancel`;

    const response = await axios.patch(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function updateLesson(
  id: string,
  data: UpsertLesson,
): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;
    const response = await axios.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function getTodayLessons(): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/today`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getLessons(studentId?: string): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons${
      studentId ? `?student_id=${studentId}` : ""
    }`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
