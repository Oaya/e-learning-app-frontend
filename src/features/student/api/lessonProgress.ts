import axios from "axios";

export async function completeLessonProgress(
  lessonProgressId: string,
): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/lesson_progresses/${lessonProgressId}/complete`;
    await axios.patch(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function incompleteLessonProgress(
  lessonProgressId: string,
): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url = `${import.meta.env.VITE_API_URL}/api/lesson_progresses/${lessonProgressId}/incomplete`;
    await axios.patch(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

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

export async function saveVideoPosition(
  lessonProgressId: string,
  watchedSeconds: number,
  durationSeconds: number,
): Promise<void> {
  const token = localStorage.getItem("jwt");
  const url = `${import.meta.env.VITE_API_URL}/api/lesson_progresses/${lessonProgressId}/save_position`;
  await axios.patch(
    url,
    { lesson_progress: { watched_seconds: watchedSeconds, duration_seconds: durationSeconds } },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function getLessonProgress(
  lessonId: string,
  userId: string,
): Promise<void> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/users/${userId}/lessons/${lessonId}/progress`;
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
