import axios from "axios";

export async function startCheckout() {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/payments/checkout`,
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
