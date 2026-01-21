import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AddCoursePrice } from "../../../type/course";
import { addCoursePrice } from "../../../api/courses";
import { useAlert } from "../../../contexts/AlertContext";
import { useCourse } from "../../../hooks/useCourse";

export default function PricingPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const alert = useAlert();
  const courseId = id ?? "";
  const { course } = useCourse(courseId);

  const [priceInput, setPriceInput] = useState<string>("");

  useEffect(() => {
    if (course?.price != null) {
      setPriceInput(Number(course.price).toFixed(2) ?? "");
    }
  }, [course?.price]);

  const mutation = useMutation({
    mutationFn: (values: AddCoursePrice) => addCoursePrice(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      navigate(`/admin/courses/${courseId}/review`);
    },
    onError: (err) => {
      alert.error(err instanceof Error ? err.message : "Failed to save course");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(priceInput);
    mutation.mutate({ id: courseId, price });
  };

  return (
    <div className="curriculum-container">
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">Pricing</h1>
      </header>

      <div>
        <h1 className="font-semibold">Set a price for your course</h1>
        <p>
          Please select the currency and the price tier for your course. If
          you'd like to offer your course for free, it must have a total video
          length of less than 2 hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-sm font-medium">Price (CAD)</label>

            <div className="mt-1 flex w-32 items-center rounded border border-gray-300 bg-white">
              <span className="pl-3 text-gray-500">$</span>

              <input
                type="number"
                name="price"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                step="0.01"
                min="0"
                inputMode="decimal"
                required
                className="w-full border-0 p-2 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <Link
              to={`/admin/courses/${id}/curriculum-builder`}
              className="btn-primary-white"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? "Saving..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
