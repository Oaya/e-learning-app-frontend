import type { CourseOverview } from "../../type/course";

export default function CourseDetailTable({
  course,
}: {
  course: CourseOverview;
}) {
  const courseDuration = course?.sections.reduce((total, section) => {
    const sectionDuration = section.lessons
      ? section.lessons.reduce((sectionTotal, lesson) => {
          return sectionTotal + (lesson.duration_in_seconds || 0);
        }, 0)
      : 0;

    //convert it to minutes
    const sectionDurationInMinutes = sectionDuration / 60;
    return Math.round(total + sectionDurationInMinutes);
  }, 0);

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Description
            </td>
            <td className="px-4 py-3">{course.description}</td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Category
            </td>
            <td className="px-4 py-3">{course.category}</td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Level
            </td>
            <td className="px-4 py-3">{course.level}</td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Price
            </td>
            <td className="px-4 py-3">
              ${course.price ? Number(course.price).toFixed(2) : ""}
            </td>
          </tr>

          <tr className="border-b border-gray-200">
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Created At
            </td>
            <td className="px-4 py-3">
              {new Date(course.created_at).toLocaleDateString()}
            </td>
          </tr>

          <tr>
            <td className="w-48 border-r border-gray-200 bg-gray-50 px-4 py-3 font-semibold">
              Course Duration
            </td>
            <td className="px-4 py-3">
              {courseDuration ? `${courseDuration} minutes` : ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
