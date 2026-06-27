import { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineX } from "react-icons/hi";

import { useUsers } from "../../students/hooks/useUsers";
import CustomSelect from "../../../../ui/CustomSelect";
import { useAlert } from "../../../../contexts/AlertContext";
import { fdString } from "../../../../utils/formData";
import { capitalize } from "../../../../utils/helper";
import { levels } from "../../../../utils/constants";
import type { StudentOption } from "../../../../type/user";
import { useHomeworks } from "../hooks/useHomeworks";
import type { Homework } from "../../../../type/homework";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "Assign" | "Edit";
  hw?: Homework;
};

export default function UpsertHomeworkModal({
  isOpen,
  onClose,
  type,
  hw,
}: ModalProps) {
  const alert = useAlert();
  const { users: students } = useUsers({});
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    hw
      ? {
          value: hw.student.id,
          label: `${hw.student.first_name} ${hw.student.last_name}`,
          avatar: hw.student.avatar,
          languages: hw.student.learning_languages,
        }
      : null,
  );
  const [aiMode, setAiMode] = useState(false);
  // const [aiTopic, setAiTopic] = useState("");
  // const [generating, setGenerating] = useState(false);

  const { createHomework, isCreating, updateHomework, isUpdating } =
    useHomeworks({
      onCreateSuccess: () => {
        alert.success("Homework created successfully.");
        onClose();
      },
      onUpdateSuccess: () => {
        alert.success("Homework updated successfully.");
        onClose();
      },
    });

  if (!isOpen) return null;

  // async function handleGenerate() {
  //   if (!aiTopic.trim()) return;
  //   setGenerating(true);
  //   // Placeholder — replace with real Anthropic API call
  //   await new Promise((r) => setTimeout(r, 1200));
  //   setForm((prev) => ({
  //     ...prev,
  //     title: `AI: ${aiTopic}`,
  //     instructions: `Practice exercise on "${aiTopic}" for a ${prev.level.toLowerCase()} student. Complete all tasks and submit by the due date.`,
  //     ai_generated: true,
  //   }));
  //   setGenerating(false);
  //   setAiMode(false);
  // }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedStudent) {
      alert.error("Please select a student.");
      return;
    }

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        student_id: selectedStudent.value,
        title: fdString(formData, "title"),
        instructions: fdString(formData, "instructions"),
        language: fdString(formData, "language"),
        status: "pending",
        level: fdString(formData, "level"),
        ai_generated: false,
        due_date: fdString(formData, "due_date"),
      };

      if (type === "Edit" && hw) {
        await updateHomework({ id: hw.id, data });
      } else {
        await createHomework(data);
      }
    } catch (error) {
      alert.error("Failed to save lesson. Try again later.");
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            {type} homework
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAiMode((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                aiMode
                  ? "bg-purple-600 text-white"
                  : "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              Generate with AI
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* AI generate panel */}
          {/* {aiMode && (
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
              <p className="mb-2 text-xs font-medium text-purple-700">
                Describe what you want Claude to generate
              </p>
              <textarea
                rows={2}
                placeholder="e.g. Past tense exercises for a Japanese intermediate student who needs to practise irregular verbs"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full resize-none rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-purple-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !aiTopic.trim()}
                className="mt-2 flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                <HiOutlineSparkles className="h-3.5 w-3.5" />
                {generating ? "Generating…" : "Generate"}
              </button>
            </div>
          )} */}

          {/* Student */}
          <div>
            <label className="sm-label">Student</label>
            <CustomSelect
              name="student"
              withAvatar
              value={selectedStudent}
              onChange={(opt: StudentOption | null) => setSelectedStudent(opt)}
              options={(students ?? []).map((i) => ({
                value: i.id,
                label: `${i.first_name} ${i.last_name}`,
                avatar: i.avatar,
                languages: i.learning_languages,
              }))}
            />
          </div>

          {/* Title */}
          <div>
            <label className="sm-label">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={hw?.title}
              required
              placeholder="e.g. Write 10 sentences using past tense"
              className="form-input"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="sm-label">Instructions</label>
            <textarea
              name="instructions"
              rows={3}
              defaultValue={hw?.instructions}
              placeholder="Describe what the student should do…"
              className="form-textarea"
            />
          </div>

          {/* Language + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sm-label">Language</label>
              <CustomSelect
                name="language"
                className="w-full"
                defaultValue={
                  hw?.language
                    ? { value: hw.language, label: capitalize(hw.language) }
                    : undefined
                }
                options={selectedStudent?.languages?.map((lang) => ({
                  value: lang,
                  label: capitalize(lang),
                }))}
              />
            </div>
            <div>
              <label className="sm-label">Level</label>
              <CustomSelect
                name="level"
                className="w-full"
                defaultValue={
                  hw?.level
                    ? { value: hw.level, label: capitalize(hw.level) }
                    : undefined
                }
                options={levels.map((level) => ({
                  value: level,
                  label: capitalize(level),
                }))}
              />
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="sm-label">Due date</label>
            <input
              type="date"
              name="due_date"
              defaultValue={hw?.due_date}
              required
              className="form-input"
            />
          </div>

          {/* Actions */}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary-white mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-pink"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? type === "Edit"
                  ? "Saving..."
                  : "Assigning..."
                : type === "Edit"
                  ? "Save Changes"
                  : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
