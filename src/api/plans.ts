import axios from "axios";
import type { Plan } from "../type/plan";

export async function getPlans(): Promise<Plan[]> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/plans`;
    const response = await axios.get(url);

    console.log("Get plans response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
