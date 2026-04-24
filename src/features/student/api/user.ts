import axios from "axios";
import type {
  Enrollment,
  UserEnrollmentWithStatus,
} from "../../../type/enrollment";

export async function getUserEnrollments(id: string): Promise<Enrollment[]> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${id}/enrollments`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Get user Enrollments response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function getUserCourseWithStatus(
  userId: string,
  courseId: string,
): Promise<UserEnrollmentWithStatus> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${userId}/courses/${courseId}/status`;
    const response = await axios.get(url, {
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
