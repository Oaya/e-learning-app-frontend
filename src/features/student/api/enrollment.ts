import axios from "axios";

export async function createLessonProgresses(
  enrollmentId: string,
): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/enrollments/${enrollmentId}/start`;
    const response = await axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get user course status response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
