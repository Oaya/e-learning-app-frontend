import type { Homework } from "./homework";

export type HomeworkSubmissionStatus =
  | "pending"
  | "draft"
  | "submitted"
  | "overdue"
  | "reviewed";

export const ATTACHMENT_TYPE = ["file", "video", "link"] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPE)[number];

export type Attachment = {
  id: string;
  type: AttachmentType;
  sub: string;
  file?: File;
  url?: string;
  filename?: string;
};
export type HomeworkAttachmentInput = {
  type: AttachmentType;
  file?: File;
  url?: string;
  sub: string;
};

export type UpsertHomeworkSubmission = {
  homework_id: string;
  answer_text?: string;
  attachments?: HomeworkAttachmentInput[];
  status: HomeworkSubmissionStatus;
};

export type HomeworkSubmission = {
  id: string;
  homework: Homework;
  submission_text?: string;
  attachments?: {
    name: string;
    size: string;
    type: AttachmentType;
  }[];
  ai_suggestion?: string;
};
