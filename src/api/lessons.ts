import axios from "axios";
import type { UpsertLesson, UpsertLessonMeeting } from "../type/lesson";
import { authHeader } from "./auth";

export async function createLesson(data: UpsertLesson): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons`;

    const response = await axios.post(url, data, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function deleteLesson(id: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;

    const response = await axios.delete(url, {
      headers: authHeader(),
    });

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
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;
    const response = await axios.patch(url, data, {
      headers: authHeader(),
    });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function getTodayLessons(): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/today`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function getLessons(studentId?: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons${
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

export async function getLessonById(id: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function joinLesson(lessonId: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/token`;

    const response = await axios.get(url, {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function upsertLessonMeeting(
  id: string,
  data: UpsertLessonMeeting,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/${id}/end`;
    const response = await axios.patch(url, data, {
      headers: authHeader(),
    });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function AddStudentNote(
  id: string,
  data: { student_note: string },
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/${id}/student_note`;
    const response = await axios.patch(url, data, {
      headers: authHeader(),
    });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}
