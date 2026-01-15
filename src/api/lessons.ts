import axios from "axios";
import type { CreateLesson, Lesson, UpdateLesson } from "../type/lesson";
import { deleteS3Object, getPresignedUrl, uploadToS3 } from "./aws";

export async function createLessonWithVideo(
  data: CreateLesson,
): Promise<Lesson> {
  let video_key: string | null = null;

  if (data.video) {
    const { key, put_url } = await getPresignedUrl(data.video, "lesson_videos");
    await uploadToS3(put_url, data.video);
    video_key = key;
  }

  const { video, ...rest } = data;

  return createLesson({
    ...rest,
    video_name: video?.name || null,
    video_key,
  });
}

export async function createLesson(
  data: CreateLesson & { video_key: string | null; video_name?: string | null },
): Promise<Lesson> {
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
  const { id, video, existing_key, removed, new_file, ...data } = values;

  console.log("values", values);

  let newKey: string | null | undefined = undefined;

  // user chose a new file
  if (new_file) {
    const { key, put_url } = await getPresignedUrl(new_file, "lesson_videos");
    await uploadToS3(put_url, new_file);
    newKey = key;
  }

  // user removed existing video (and didn’t pick a new one)
  if (!new_file && removed) {
    newKey = null;
  }

  // update DB
  const updated = await updateLesson({
    id,
    ...data,
    ...(newKey !== undefined
      ? { video_key: newKey, video_name: new_file?.name || null }
      : {}),
  });

  // delete old video AFTER success
  if (newKey !== undefined && existing_key && existing_key !== newKey) {
    await deleteS3Object(existing_key);
  }

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
