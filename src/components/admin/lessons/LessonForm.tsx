import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";

import { fdString } from "../../../utils/formData";
import { useAlert } from "../../../contexts/AlertContext";
import type { UpsertLesson, Lesson } from "../../../type/lesson";
import { lessonTypes } from "../../../utils/constants";
import { getVideoDuration } from "../../../utils/helper";
import ReadingEditor from "./ReadingEditor";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Lesson;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: (values: UpsertLesson) => void;
  onCancel: () => void;
};

export default function LessonForm({
  mode,
  defaultValues,
  isSubmitting = false,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const alert = useAlert();

  // If you have these fields on Lesson
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(
    defaultValues?.video || null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState<boolean>(false);
  const [articleHtml, setArticleHtml] = useState<string>(
    defaultValues?.article ?? "",
  );
  const [durationSeconds, setDurationSeconds] = useState<number>(
    defaultValues?.duration_in_seconds ?? 0,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error, alert]);

  const initialType = useMemo(() => {
    return defaultValues?.lesson_type ?? lessonTypes[0] ?? "";
  }, [defaultValues?.lesson_type]);

  const [selectedType, setSelectedType] = useState<string>(initialType);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke old blob preview URL if any
    if (videoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(URL.createObjectURL(file));
    setVideoFile(file);
    setRemoved(false);

    if (file) {
      const duration = await getVideoDuration(file);
      setDurationSeconds(Math.round(duration));
    }
  };

  const removeVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:"))
      URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setVideoFile(null);
    setRemoved(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const data: UpsertLesson = {
      title: fdString(fd, "title").trim(),
      description: fdString(fd, "description").trim(),
      lesson_type: fdString(fd, "lesson_type").trim(),
      video: videoFile,
      video_signed_id: "",
      duration_in_seconds: durationSeconds,
      article: selectedType === "Reading" ? articleHtml : undefined,
    };

    onSubmit(data);
  };

  const showVideoFields = selectedType === "Video";

  return (
    <div className="mt-3 space-y-6 rounded border border-gray-300 p-6">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="sm-label mb-2">Lesson Type</label>
          <div className="flex flex-wrap gap-2">
            {lessonTypes.map((type) => {
              const checked = selectedType === type;

              return (
                <label
                  key={type}
                  className={`cursor-pointer rounded-full border px-4 py-1 text-sm transition disabled:opacity-60 ${
                    checked
                      ? "bg-c-light-yellow border-c-light-yellow text-white"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="lesson_type"
                    value={type}
                    checked={checked}
                    onChange={() => {
                      setSelectedType(type);

                      // Optional: if switching away from Video, clear pending file
                      if (type !== "Video") {
                        if (videoPreviewUrl && videoFile?.name)
                          URL.revokeObjectURL(videoPreviewUrl);
                        setVideoFile(null);
                        setRemoved(false);
                        setVideoPreviewUrl(defaultValues?.video || null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }
                    }}
                    className="sr-only"
                    required
                    disabled={isSubmitting}
                  />
                  {type}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] items-end gap-4">
          <div>
            <label className="sm-label">Lesson Title</label>
            <input
              name="title"
              defaultValue={defaultValues?.title ?? ""}
              required
              disabled={isSubmitting}
              className="form-input mt-1 w-full"
              placeholder="Enter a Title"
            />
          </div>

          <div>
            <label className="sm-label">Duration (minutes)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={durationSeconds ? Math.ceil(durationSeconds / 60) : ""}
              onChange={(e) =>
                setDurationSeconds(Number(e.target.value || 0) * 60)
              }
              required
              disabled={isSubmitting || selectedType === "Video"}
              className="form-input mt-1 w-full"
              placeholder="e.g. 5"
            />
          </div>
        </div>

        <div>
          <label className="sm-label">
            What will students learn in this lesson?
          </label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description ?? ""}
            disabled={isSubmitting}
            className="form-input mt-1 w-full"
            placeholder="Enter lesson description"
          />
        </div>

        {showVideoFields ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-6">
              <div className="mb-2">
                <div className="h-46 w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
                  {videoPreviewUrl ? (
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src="/src/assets/placeholder.webp"
                      alt="Placeholder"
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="mb-2 overflow-y-auto">
                <p className="block text-sm">
                  Upload your course video here. Accepted formats: MP4, WEBM,
                  OGG.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  id="video-upload"
                  name="video"
                  accept="video/mp4,video/webm,video/ogg"
                  className="sr-only"
                  onChange={handleVideoChange}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="video-upload"
                  className="form-input mt-2 flex cursor-pointer items-center justify-between"
                >
                  <span className="text-md min-w-0 flex-1 truncate">
                    {videoFile
                      ? videoFile.name
                      : removed
                        ? "Upload Video"
                        : defaultValues?.video
                          ? "Replace Video"
                          : "Upload Video"}
                  </span>

                  {/* show trash if there is either a new file OR an existing video */}
                  {(videoFile || (!!defaultValues?.video && !removed)) && (
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="text-c-pink ml-4 flex"
                      aria-label="Remove video"
                      disabled={isSubmitting}
                    >
                      <BiSolidTrashAlt size={18} />
                    </button>
                  )}
                </label>
              </div>
            </div>
          </div>
        ) : (
          //Article text placeholder
          <div>
            <label className="sm-label">Article Content</label>

            <ReadingEditor value={articleHtml} onChange={setArticleHtml} />
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Add Lesson"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="btn-primary-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
