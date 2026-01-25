import axios from "axios";
import type { CreateLesson, Lesson, UpdateLesson } from "../type/lesson";
import { directUploadToActiveStorage } from "./files";

export async function createLessonWithVideo(
  data: CreateLesson,
): Promise<Lesson> {
  let video_signed_id: string | null = null;

  if (data.video) {
    video_signed_id = await directUploadToActiveStorage(
      data.video,
      "lesson_video",
    );
  }

  const { video, ...rest } = data;

  return createLesson(rest);
}

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

export async function updateLessonWithVideo(
  values: UpdateLesson,
): Promise<Lesson> {
  let video_signed_id: string | null = null;

  // user chose a new file
  if (values.new_file) {
    video_signed_id = await directUploadToActiveStorage(
      values.new_file,
      "lesson_video",
    );
  }

  // user removed existing video (and didn’t pick a new one)
  if (!values.new_file && values.removed) {
    video_signed_id = null;
  }

  // update DB
  const updated = await updateLesson({
    ...values,
    ...(video_signed_id !== undefined ? { video_signed_id } : {}),
  });

  return updated;
}

export async function updateLesson(data: UpdateLesson): Promise<Lesson> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${data.id}`;
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Update lesson response:", response);
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
