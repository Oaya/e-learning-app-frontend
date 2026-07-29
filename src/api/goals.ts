import axios from "axios";
import type { UpsertGoal } from "../type/goal";
import { authHeader } from "./auth";

export async function getUserGoals(studentId?: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/goals/${studentId ? `?student_id=${studentId}` : ""}`;
    const res = await axios.get(url, {
      headers: authHeader(),
    });
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function createGoal(data: UpsertGoal): Promise<ApiResponse> {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/goals`,
      data,
      {
        headers: authHeader(),
      },
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function updateGoal(
  id: string,
  data: UpsertGoal,
): Promise<ApiResponse> {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/goals/${id}`,
      data,
      { headers: authHeader() },
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function deleteGoal(goalId: string): Promise<ApiResponse> {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}`, {
      headers: authHeader(),
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
