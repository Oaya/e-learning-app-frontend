import axios from "axios";
import type { UpsertHomework, Homework } from "../type/homework";

export async function getHomeworks(): Promise<Homework[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks`;

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

export async function getHomework(id: string): Promise<Homework> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;

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

export async function createHomework(data: UpsertHomework): Promise<Homework> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks`;

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

export async function updateHomework(
  id: string,
  data: UpsertHomework,
): Promise<Homework> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;
    const response = await axios.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function deleteHomework(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/homeworks/${id}`;

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
