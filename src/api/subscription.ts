import axios from "axios";
import { authHeader } from "./auth";

export async function startCheckout(plan: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/subscription/payment_checkout`,
      { plan },
      {
        headers: authHeader(),
      },
    );

    return res;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function cancelSubscription(): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/subscription/cancel`;
    const res = await axios.post(url, null, {
      headers: authHeader(),
    });

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function changePlan(plan: string): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/subscription/change_plan`;
    const res = await axios.post(
      url,
      { plan },
      {
        headers: authHeader(),
      },
    );

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
