import axios from "axios";
import type {
  AddCoursePrice,
  Course,
  CourseOverview,
  CreateCourse,
} from "../type/course";
import type { ReorderSections } from "../type/section";
import { deleteS3Object, getPresignedUrl, uploadToS3 } from "./aws";

export async function getCourses(): Promise<Course[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get courses response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getCourseById(id: string): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Fetch course response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getCourseOverview(id: string): Promise<CourseOverview> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}/overview`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Get course details response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function reorderSections(data: ReorderSections): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${data.course_id}/sections/reorder`;
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Reorder lessons response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function createCourseWithThumbnail(
  data: CreateCourse,
): Promise<Course> {
  let thumbnail_key: string | null = null;

  if (data.thumbnail) {
    const { key, put_url } = await getPresignedUrl(data.thumbnail);
    await uploadToS3(put_url, data.thumbnail);
    thumbnail_key = key;
  }

  const { thumbnail, ...rest } = data;

  return createCourse({
    ...rest,
    thumbnail_key,
  });
}

export async function createCourse(
  data: CreateCourse & { thumbnail_key: string | null },
): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create courses response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function updateCourseWithThumbnail({
  newFile,
  removed,
  existingKey,
  courseId,
  data,
}: {
  newFile: File | null;
  removed: boolean;
  existingKey: string | null | undefined;
  courseId: string;
  data: CreateCourse;
}): Promise<Course> {
  let newKey: string | null | undefined = undefined;

  // Case 1: user chose a new file
  if (newFile) {
    const { key, put_url } = await getPresignedUrl(newFile);
    await uploadToS3(put_url, newFile);
    newKey = key;
  }

  // Case 2: user removed existing thumbnail
  if (!newFile && removed) {
    newKey = null;
  }

  // Update the course first
  const updated = await updateCourse(courseId, {
    ...data,
    ...(newKey !== undefined ? { thumbnail_key: newKey } : {}),
  });

  // Delete old file AFTER DB update succeeds
  if (newKey !== undefined && existingKey && existingKey !== newKey) {
    await deleteS3Object(existingKey);
  }

  return updated;
}

export async function updateCourse(
  id: string,
  data: CreateCourse,
): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}`;
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Update course response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function addCoursePrice(data: AddCoursePrice): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${data.id}/price`;
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Add course price response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function publishCourse(id: string): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}/publish`;
    const response = await axios.patch(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Publish course response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
