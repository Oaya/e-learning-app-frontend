type HomeworkSubmissionStatus = "draft" | "submitted";

export type HomeworkAttachmentInput = {
  kind: "file" | "video" | "link";
  file?: File;
  url?: string;
};

export type UpsertHomeworkSubmission = {
  id?: string;
  homework_id: string;
  answer_text?: string;
  attachments?: HomeworkAttachmentInput[];
  status: HomeworkSubmissionStatus;
};
