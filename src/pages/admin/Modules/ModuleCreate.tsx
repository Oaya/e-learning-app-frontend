import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fdString } from "../../../utils/formData";
import type { CreateCourse } from "../../../type/course";
import { createCourse } from "../../../api/courses";
import { useCourse } from "../../../hooks/useCourse";

export default function ModuleCreate() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";
  const { course } = useCourse(courseId);

  console.log("Course ID from params:", courseId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  //Mutation to create a course
  const mutation = useMutation({
    mutationFn: (data: CreateCourse) => createCourse(data),
    onSuccess: (course) => {
      //Refresh the courses list after creating a new course
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      //Navigate to the course edit page to add modules and lessons
      navigate(`/admin/course/${course.id}/modules/new`);
    },
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      title: fdString(formData, "title"),
      description: fdString(formData, "description"),
    };

    try {
      mutation.mutate(data);
    } catch (err) {
      setError(err as string);
    }
    // Handle course creation logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{course?.title}</h3>
          <Link
            to={`/admin/courses/${courseId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to edit course
          </Link>
        </div>
        <p className="text-md text-gray-600">{course?.description}</p>
      </div>

      {/* Course form */}
      <form
        onSubmit={handleCreateCourse}
        className="max-w-2xl space-y-5 rounded border bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Add Modules</h1>
            <p className="text-sm text-gray-600">
              Add modules to structure your course content.
            </p>
          </div>
        </div>
        <div>{error && <p>{error}</p>}</div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="What will students learn?"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-c-pink rounded px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Next
          </button>

          <Link
            to="/admin"
            className="rounded border border-gray-300 px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
