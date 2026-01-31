import axios from "axios";
import type { UpsertLesson, Lesson } from "../type/lesson";
import { directUploadToActiveStorage } from "./files";

export async function createLesson(data: UpsertLesson): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    const createData = { ...data };

    if (data.video && data.video instanceof File) {
      createData.video_signed_id = await directUploadToActiveStorage(
        data.video,
        "lesson_video",
      );

      delete createData.video;
    }

    console.log("Creating lesson with data:", createData);

    const url: string = `${import.meta.env.VITE_API_URL}/api/sections/${data.section_id}/lessons`;
    const response = await axios.post(url, createData, {
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

export async function updateLesson(
  data: UpsertLesson,
  id: string,
): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");

    if (!token) throw new Error("Not authenticated");

    const updateData = { ...data };

    // If user did NOT select a new file, do NOT send thumbnail_signed_id at all
    delete updateData.video_signed_id;

    if (data.video && data.video instanceof File) {
      updateData.video_signed_id = await directUploadToActiveStorage(
        data.video,
        "lesson_video",
      );

      delete updateData.video;
    } else {
      delete updateData.video; //avoid sending the File | null back to the server
    }

    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${id}`;
    const response = await axios.patch(url, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
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

    console.log("Delete lesson response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
