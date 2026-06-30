import axios from "axios";
import { directUploadToActiveStorage } from "./files";
import type {
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

export async function createHomeworkSubmission(
  data: UpsertHomeworkSubmission,
): Promise<HomeworkSubmission> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    let uploadedAttachments;

    if (data.attachments) {
      uploadedAttachments = await Promise.all(
        data.attachments.map(async (a) => {
          if (a.type === "link")
            return { url: a.url, type: a.type, sub: a.sub };
          const signed_id = await directUploadToActiveStorage(
            a.file!,
            "homework",
          );
          return { signed_id, type: a.type, sub: a.sub };
        }),
      );
    }

    const url = `${import.meta.env.VITE_API_URL}/api/homework_submissions`;
    const response = await axios.post(
      url,
      {
        homework_id: data.homework_id,
        answer_text: data.answer_text,
        status: data.status,
        attachments: uploadedAttachments,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("Create homework submissions response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}

export async function draftSaveHomeworkSubmission(
  data: UpsertHomeworkSubmission,
): Promise<HomeworkSubmission> {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Not authenticated");

    let uploadedAttachments;

    if (data.attachments) {
      uploadedAttachments = await Promise.all(
        data.attachments.map(async (a) => {
          if (a.type === "link")
            return { type: a.type, url: a.url, kind: "homework" };
          const signed_id = await directUploadToActiveStorage(
            a.file!,
            "homework",
          );
          return { signed_id, type: a.type, sub: a.sub };
        }),
      );
    }

    const url = `${import.meta.env.VITE_API_URL}/api/homework_submissions/draft`;
    const response = await axios.post(
      url,
      { answer_text: data.answer_text, attachments: uploadedAttachments },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("Create homework submissions response:", response);
    return response.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error);
  }
}
