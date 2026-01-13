import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CourseOverview from "../../../components/admin/CourseOverview";
import { useCourseOverview } from "../../../hooks/useCourseOverview";
import type { AddCoursePrice } from "../../../type/course";
import { addCoursePrice } from "../../../api/courses";
import { useAlert } from "../../../contexts/AlertContext";

export default function PricingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();
  const courseId = id ?? "";
  const { course } = useCourseOverview(courseId);

  const [price, setPrice] = useState<number | null>(
    course?.course_price ?? null,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price !== null) {
      mutation.mutate({ id: courseId, price });
    } else {
      navigate(`/admin/courses/${courseId}/review`);
    }
  };

  const mutation = useMutation({
    mutationFn: (values: AddCoursePrice) => {
      return addCoursePrice(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseOverview", courseId],
      });

      navigate(`/admin/courses/${courseId}/review`);
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save course");
    },
  });

  return (
    <div>
      <header className="flex h-14 items-center justify-between pb-10">
        <h1 className="text-2xl font-semibold">Pricing</h1>
      </header>

      <div className="flex gap-10">
        <div>
          <h1 className="font-semibold">Set a price for your course</h1>
          <p>
            Please select the currency and the price tier for your course. If
            you'd like to offer your course for free, it must have a total video
            length of less than 2 hours.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 mb-2 flex flex-1 flex-col gap-6"
          >
            <div className="mb-2">
              <label className="block text-sm font-medium">Price (CAD)</label>
              <div className="mt-1 flex w-32 items-center rounded border border-gray-300 bg-white">
                <span className="pl-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={price !== null ? price : ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  name="price"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  required
                  className="w-full border-0 p-2 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </form>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-dark-purple rounded px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {mutation.isPending ? "Saving..." : "Next"}
            </button>
          </div>
        </div>

        <div className="bg-c-purple/30 w-110 shrink-0 rounded border border-gray-300 p-4">
          <CourseOverview id={courseId} />
        </div>
      </div>
    </div>
  );
}
