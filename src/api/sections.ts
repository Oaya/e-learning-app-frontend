import axios from "axios";
import type { CreateSection, Section, UpdateSection } from "../type/section";
import type { ReorderLessons } from "../type/lesson";

export async function createSection(data: CreateSection): Promise<Section> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${data.course_id}/sections`;
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

export async function updateSection(data: UpdateSection): Promise<Section> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sections/${data.id}`;
    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Update section response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function deleteSection(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sections/${id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete section response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function reorderLessons(data: ReorderLessons): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sections/${data.section_id}/lessons/reorder`;
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
