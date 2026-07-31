import axios from "axios";
import { authHeader } from "./auth";
import { directUploadToActiveStorage } from "./files";

type AddLessonRecordingData = {
  video: File;
  durationInSeconds: number;
  fileSize: number;
};

export async function addLessonRecording(
  lessonId: string,
  data: AddLessonRecordingData,
): Promise<ApiResponse> {
  try {
    const videoSignedId = await directUploadToActiveStorage(
      data.video,
      "lesson_recording",
    );

    const url: string = `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/recording`;

    const response = await axios.post(
      url,
      {
        video_signed_id: videoSignedId,
        duration_in_seconds: data.durationInSeconds,
        file_size: data.fileSize,
      },
      {
        headers: authHeader(),
      },
    );

    return { success: true, data: response.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
  }
}
