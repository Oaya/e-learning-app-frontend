import { useCourseOverview } from "../../hooks/useCourseOverview";

export default function CourseOverview({ id }: { id?: string }) {
  const courseId = id ?? "";
  const { course } = useCourseOverview(courseId);
  return (
    <div className="border-gray-300 p-4">
      <h2 className="text-center text-xl font-semibold">Overview</h2>
      {course ? (
        <div className="text-md text-gray-600">
          <p className="font-semibold">
            Title:
            <span className="ml-2 font-normal"> {course.title}</span>
          </p>
          <p className="font-semibold">
            Description:
            <span className="ml-2 font-normal"> {course.description}</span>
          </p>
          <p className="font-semibold">
            Category:
            <span className="ml-2 font-normal"> {course.category}</span>
          </p>
          <p className="font-semibold">
            Level:
            <span className="ml-2 font-normal"> {course.level}</span>
          </p>

          <div>
            <h1>Sections</h1>
            {course.sections && course.sections.length > 0 ? (
              <ul className="list-disc pl-5">
                {course.sections.map((section) => (
                  <li key={section.id} className="mb-2">
                    <p className="font-semibold">{section.title}</p>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                    {section.lessons && section.lessons.length > 0 && (
                      <ul className="list-circle mt-1 pl-5">
                        {section.lessons.map((lesson) => (
                          <li key={lesson.id} className="mb-1">
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-gray-600">
                              {lesson.description} (
                              {lesson.lesson_type.replace("_", " ")})
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
