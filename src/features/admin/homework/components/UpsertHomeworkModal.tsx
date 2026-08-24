import { useState } from "react";

import { useUsers } from "@/features/admin/students/hooks/useUsers";
import CustomSelect from "@/ui/CustomSelect";
import ModalShell from "@/ui/ModalShell";
import FormField from "@/ui/FormField";
import { useAlert } from "@/contexts/AlertContext";
import { fdString } from "@/utils/formData";
import { levels, type StudentOption, type User } from "@/type/user";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import type { Homework } from "@/type/homework";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "Assign" | "Edit";
  hw?: Homework;
  student?: User;
};

export default function UpsertHomeworkModal({
  isOpen,
  onClose,
  type,
  hw,
  student,
}: ModalProps) {
  const alert = useAlert();
  const { users: students } = useUsers({});
  const { createHomework, isCreating, updateHomework, isUpdating } =
    useHomeworks();

  const hData = hw ? hw.student : student ? student : null;
  const defaultLanguage = hw ? hw.language : null;

  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    hData
      ? {
          value: hData.id,
          label: `${hData.first_name} ${hData.last_name}`,
          avatar: hData.avatar,
          language_levels: hData.language_levels,
        }
      : null,
  );

  if (!isOpen) return null;

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
      onClose();
    } catch {
      // handled by the mutation's onError
    }
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={`${type} homework`}>
      <form onSubmit={handleSubmit} className="modal-body">
        {/* Student */}
        <FormField label="Student">
          <CustomSelect
            name="student"
            withAvatar
            isDisabled={!!hData}
            value={selectedStudent}
            onChange={(opt: StudentOption | null) => setSelectedStudent(opt)}
            options={(students ?? []).map((i) => ({
              value: i.id,
              label: `${i.first_name} ${i.last_name}`,
              avatar: i.avatar,
              language_levels: i.language_levels,
            }))}
          />
        </FormField>

        {/* Title */}
        <FormField label="Title">
          <input
            type="text"
            name="title"
            defaultValue={hw?.title}
            required
            placeholder="e.g. Write 10 sentences using past tense"
            className="form-input"
          />
        </FormField>

        {/* Instructions */}
        <FormField label="Instructions">
          <textarea
            name="instructions"
            rows={3}
            defaultValue={hw?.instructions}
            placeholder="Describe what the student should do…"
            className="form-textarea"
          />
        </FormField>

        {/* Language + Level */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <FormField label="Language">
            <CustomSelect
              name="language"
              className="w-full capitalize"
              defaultValue={
                defaultLanguage
                  ? {
                      value: defaultLanguage,
                      label: defaultLanguage,
                    }
                  : undefined
              }
              options={selectedStudent?.language_levels?.map((ll) => ({
                value: ll.language,
                label: ll.level ? `${ll.language} · ${ll.level}` : ll.language,
              }))}
            />
          </FormField>

          <FormField label="Homework Level">
            <CustomSelect
              name="level"
              className="w-full capitalize"
              defaultValue={
                hw?.level ? { value: hw.level, label: hw.level } : undefined
              }
              options={levels.map((level) => ({
                value: level,
                label: level,
              }))}
            />
          </FormField>
        </div>

        {/* Due date */}
        <FormField label="Due date">
          <input
            type="date"
            name="due_date"
            defaultValue={hw?.due_date}
            required
            className="form-input"
          />
        </FormField>

        {/* Actions */}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary-white mr-4"
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
    </ModalShell>
  );
}
