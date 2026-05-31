import axios from "axios";

export async function getCourseEnrollments(id: string): Promise<any[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/courses/${id}/enrollments`;
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
