import { useState } from "react";
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
} from "react-icons/hi2";

import { useUsers } from "@/features/admin/students/hooks/useUsers";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import { generateHomework } from "@/api/homeworks";
import { useAlert } from "@/contexts/AlertContext";
import CustomSelect from "@/ui/CustomSelect";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import { levels, type StudentOption } from "@/type/user";
import { EXERCISE_TYPES, TOPIC_CHIPS } from "@/utils/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentOption;
};

type Step = "configure" | "generating" | "preview";

export default function AiGenerateHomeworkModal({
  isOpen,
  onClose,
  student: defaultStudent,
}: Props) {
  const alert = useAlert();
  const { users: students } = useUsers({});
  const { createHomework, isCreating } = useHomeworks();

  // Step state
  const [step, setStep] = useState<Step>("configure");

  // Form state
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    defaultStudent ?? null,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [exerciseType, setExerciseType] = useState<string>(EXERCISE_TYPES[0]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Daily life",
  ]);
  const [customTopic, setCustomTopic] = useState("");
  const [notes, setNotes] = useState("");

  // Preview state
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  const [selectedDueDate, setDueDate] = useState<string>("");

  if (!isOpen) return null;

  // When student changes, reset language/level
  function handleStudentChange(opt: StudentOption | null) {
    setSelectedStudent(opt);
    setSelectedLanguage("");
    setSelectedLevel("");
  }

  // When language changes, auto-fill level from student's language_levels
  function handleLanguageChange(lang: string) {
    setSelectedLanguage(lang);
    if (selectedStudent?.language_levels) {
      const match = selectedStudent.language_levels.find(
        (ll) => ll.language === lang,
      );
      if (match) setSelectedLevel(match.level ?? "");
    }
  }

  function toggleTopic(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }

  // Language options: if student has language_levels use those; fallback to learning_languages
  function getLanguageOptions() {
    if (selectedStudent?.language_levels?.length) {
      return selectedStudent.language_levels.map((ll) => ({
        value: ll.language,
        label: `${ll.language} · ${ll.level}`,
      }));
    }
    return (selectedStudent?.language_levels ?? []).map((lang) => ({
      value: lang,
      label: lang,
    }));
  }

  async function handleGenerate() {
    if (!selectedStudent) {
      alert.error("Please select a student.");
      return;
    }
    if (!selectedLanguage) {
      alert.error("Please select a target language.");
      return;
    }

    const topics =
      selectedTopics.length > 0
        ? selectedTopics
        : customTopic
          ? [customTopic]
          : [];

    if (topics.length === 0 && !customTopic.trim()) {
      alert.error("Please select at least one topic.");
      return;
    }

    setStep("generating");

    const res = await generateHomework({
      student_id: selectedStudent.value,
      language: selectedLanguage,
      level: selectedLevel,
      exercise_type: exerciseType,
      topics: customTopic.trim() ? [...topics, customTopic.trim()] : topics,
      notes: notes.trim() || undefined,
    });

    if (res.success) {
      setGeneratedTitle(res.data.title ?? "");
      setGeneratedContent(res.data.instructions ?? "");
      setStep("preview");
    } else {
      alert.error(
        res.error || "Failed to generate homework. Please try again.",
      );
      setStep("configure");
    }
  }

  async function handleSave() {
    if (!selectedStudent) return;

    try {
      await createHomework({
        student_id: selectedStudent.value,
        title: generatedTitle,
        instructions: generatedContent,
        language: selectedLanguage,
        level: selectedLevel,
        ai_generated: true,
        due_date: selectedDueDate,
      });
      handleClose();
    } catch {
      // handled by mutation onError
    }
  }

  function handleClose() {
    setStep("configure");
    setSelectedStudent(defaultStudent ?? null);
    setSelectedLanguage("");
    setSelectedLevel("");
    setExerciseType(EXERCISE_TYPES[0]);
    setSelectedTopics(["Daily life"]);
    setCustomTopic("");
    setNotes("");
    setGeneratedTitle("");
    setGeneratedContent("");
    onClose();
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate homework with AI"
      maxWidth="max-w-2xl"
      headerExtra={
        <span className="budge-purple">
          <HiOutlineSparkles size={12} />
          AI
        </span>
      }
    >
      {/* Step: Configure */}
      {step === "configure" && (
        <div className="modal-body">
          {/* Student */}
          <FormField label="Student">
            <CustomSelect
              name="student"
              withAvatar
              isDisabled={!!defaultStudent}
              value={selectedStudent}
              onChange={(opt: StudentOption | null) => handleStudentChange(opt)}
              options={(students ?? []).map((u) => ({
                value: u.id,
                label: `${u.first_name} ${u.last_name}`,
                avatar: u.avatar,
                language_levels: u.language_levels,
              }))}
            />
          </FormField>

          {/* Language + Level */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <FormField label="Target language">
              <CustomSelect
                name="language"
                isDisabled={!selectedStudent}
                value={
                  selectedLanguage
                    ? { value: selectedLanguage, label: selectedLanguage }
                    : null
                }
                onChange={(opt: any) =>
                  handleLanguageChange(opt ? opt.value : "")
                }
                options={getLanguageOptions()}
                placeholder={
                  selectedStudent ? "Select language" : "Select a student first"
                }
              />
            </FormField>

            <FormField label="Student level">
              <CustomSelect
                name="level"
                value={
                  selectedLevel
                    ? { value: selectedLevel, label: selectedLevel }
                    : null
                }
                onChange={(opt: any) => setSelectedLevel(opt ? opt.value : "")}
                options={levels.map((l) => ({ value: l, label: l }))}
                className="capitalize"
                placeholder="Select level"
              />
              {selectedLevel && selectedLanguage && (
                <p className="text-theme-purple-50 mt-1 text-[11px]">
                  Auto-filled from student profile
                </p>
              )}
            </FormField>
          </div>

          {/* Exercise type */}
          <FormField label="Exercise type">
            <div className="flex flex-wrap gap-1.5">
              {EXERCISE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExerciseType(type)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    exerciseType === type
                      ? "budge-purple"
                      : "border border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </FormField>

          {/* Topic */}
          <FormField label="Topic / Theme">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {TOPIC_CHIPS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selectedTopics.includes(topic)
                      ? "budge-purple"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Or describe your own topic…"
              className="form-input"
            />
          </FormField>

          {/* Notes */}
          <FormField label="Additional notes (optional)">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on past tense, keep it under 10 questions…"
              className="form-textarea"
            />
          </FormField>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-primary-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="btn-primary-pink flex items-center gap-2"
            >
              <HiOutlineSparkles size={15} />
              Generate
            </button>
          </div>
        </div>
      )}

      {/* Step: Generating */}
      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 animate-spin text-purple-500">
            <HiOutlineSparkles size={32} />
          </div>
          <p className="text-sm text-gray-500">
            Generating homework
            {selectedStudent ? ` for ${selectedStudent.label}` : ""}…
          </p>
          {selectedLanguage && selectedLevel && (
            <p className="mt-1 text-xs text-gray-400">
              {selectedLanguage} · {selectedLevel} · {exerciseType}
            </p>
          )}
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="modal-body">
          {selectedStudent && (
            <p className="text-xs text-gray-400">
              For:{" "}
              <span className="font-medium text-gray-600">
                {selectedStudent.label}
              </span>
              {selectedLanguage && (
                <>
                  {" "}
                  · {selectedLanguage}
                  {selectedLevel && ` (${selectedLevel})`}
                </>
              )}
            </p>
          )}

          <FormField label="Homework title">
            <textarea
              rows={3}
              className="form-textarea font-medium"
              value={generatedTitle}
              onChange={(e) => setGeneratedTitle(e.target.value)}
            />
          </FormField>

          <FormField label="Generated content">
            <textarea
              rows={10}
              className="form-textarea font-mono text-xs leading-relaxed"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
            />
          </FormField>

          {/* Due date */}
          <FormField label="Due date">
            <input
              type="date"
              required
              className="form-input"
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormField>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("configure")}
              className="btn-primary-white flex items-center gap-1.5"
            >
              <HiOutlineArrowLeft size={14} />
              Back to configure
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="btn-white flex items-center gap-1.5"
              >
                <HiOutlineArrowPath size={14} />
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isCreating}
                className="btn-primary-pink flex items-center gap-2"
              >
                {isCreating ? "Saving…" : "Save homework"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
