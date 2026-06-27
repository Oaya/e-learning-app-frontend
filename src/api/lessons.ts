import axios from "axios";
import type { UpsertLesson, Lesson } from "../type/lesson";

export async function createLesson(data: UpsertLesson): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons`;

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function deleteLesson(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function cancelLesson(id: string): Promise<void> {
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

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function updateLesson(
  id: string,
  data: UpsertLesson,
): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;
    const response = await axios.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function getTodayLessons(): Promise<Lesson[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/today`;

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

export async function getLessons(): Promise<Lesson[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons`;

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
