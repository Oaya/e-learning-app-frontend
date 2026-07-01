import axios from "axios";
import { directUploadToActiveStorage } from "./files";
import type {
  FeedbackData,
  HomeworkSubmission,
  UpsertHomeworkSubmission,
} from "../type/homework_submission";

export async function getHomeworkSubmission(
  id: string,
): Promise<HomeworkSubmission> {
  try {
    const token = localStorage.getItem("jwt");
    const url: string = `${import.meta.env.VITE_API_URL}/api/homework_submission/${id}`;

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

export async function upsertHomeworkSubmission(
  data: UpsertHomeworkSubmission,
): Promise<HomeworkSubmission> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    let uploadedAttachments;
    const keep_attachment_ids: string[] = [];

    if (data.attachments) {
      const results = await Promise.all(
        data.attachments.map(async (a) => {
          if (a.type === "link") {
            return { url: a.url, type: a.type, sub: a.sub };
          } else if (a.file) {
            const signed_id = await directUploadToActiveStorage(
              a.file,
              "homework",
            );
            return { signed_id, type: a.type, sub: a.sub };
          } else if (a.id) {
            keep_attachment_ids.push(a.id);
          }
        }),
      );
      uploadedAttachments = results.filter((a) => a !== undefined);
    }

    console.log(uploadedAttachments, keep_attachment_ids);
    const url = `${import.meta.env.VITE_API_URL}/api/homework_submissions`;
    const response = await axios.post(
      url,
      {
        homework_id: data.homework_id,
        answer_text: data.answer_text,
        status: data.status,
        attachments: uploadedAttachments,
        keep_attachment_ids,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.response?.data?.error);
  }
}

export async function createFeedback(
  data: FeedbackData,
): Promise<HomeworkSubmission> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    const { submission_id, ...rest } = data;

    const url = `${import.meta.env.VITE_API_URL}/api/homework_submissions/${submission_id}/feedback`;
    const response = await axios.patch(
      url,
      {
        ...rest,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.response?.data?.error);
  }
}
