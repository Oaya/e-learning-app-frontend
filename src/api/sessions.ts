import axios from "axios";
import type { CreateSession, UpdateSession, Session } from "../type/session";

export async function createSession(data: CreateSession): Promise<Session> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sessions`;

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

export async function deleteSession(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sessions/${id}`;

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

export async function cancelSession(id: string): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sessions/${id}/cancel`;

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

export async function updateSession(
  id: string,
  data: UpdateSession,
): Promise<Session> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/sessions/${id}`;
    const response = await axios.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error);
  }
}

export async function getTodaySessions(): Promise<Session[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/sessions/today`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get Today Session response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
