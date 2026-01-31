import axios from "axios";
import type {
  AddCoursePrice,
  Course,
  CourseOverview,
  UpsertCourse,
} from "../type/course";
import type { ReorderSections } from "../type/section";
import { directUploadToActiveStorage } from "./files";

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

export async function deleteCourse(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete course response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function createCourse(data: UpsertCourse): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");

    if (!token) throw new Error("Not authenticated");

    const createData = { ...data };

    // Upload thumbnail if present
    if (data.thumbnail && data.thumbnail instanceof File) {
      createData.thumbnail_signed_id = await directUploadToActiveStorage(
        data.thumbnail,
        "course_thumbnails",
      );
    }

    const url: string = `${import.meta.env.VITE_API_URL}/api/courses`;
    const response = await axios.post(url, createData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function updateCourse(
  id: string,
  data: UpsertCourse,
): Promise<Course> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    const updateData: any = { ...data };

    // If user did NOT select a new file, do NOT send thumbnail_signed_id at all
    delete updateData.thumbnail_signed_id;

    if (data.thumbnail && data.thumbnail instanceof File) {
      updateData.thumbnail_signed_id = await directUploadToActiveStorage(
        data.thumbnail,
        "course_thumbnails",
      );
      delete updateData.thumbnail;
    } else {
      delete updateData.thumbnail; // avoid sending File/null/etc.
    }

    const url = `${import.meta.env.VITE_API_URL}/api/courses/${id}`;
    const response = await axios.put(url, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
