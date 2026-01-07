import axios from "axios";
import type { CreateSection, Section, UpdateSection } from "../type/section";

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
