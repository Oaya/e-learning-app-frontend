import axios from "axios";
import type { CreateLesson, Lesson } from "../type/lesson";

export async function createLesson(data: CreateLesson): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sections/${data.section_id}/lessons`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create lesson response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
