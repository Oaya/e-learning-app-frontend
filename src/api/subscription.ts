import axios from "axios";

export async function startCheckout() {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/subscription/payment_checkout`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Start checkout response:", res);

    return res;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function cancelSubscription(): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) return { success: false, error: "No token" };

    const url = `${import.meta.env.VITE_API_URL}/api/subscription/cancel`;
    const res = await axios.post(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}

export async function changePlan(plan: string): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) return { success: false, error: "No token" };
    const url = `${import.meta.env.VITE_API_URL}/api/subscription/change_plan`;
    const res = await axios.post(
      url,
      { plan },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
