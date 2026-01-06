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
            <h1>Modules</h1>
            {course.modules && course.modules.length > 0 ? (
              <ul className="list-disc pl-5">
                {course.modules.map((module) => (
                  <li key={module.id} className="mb-2">
                    <p className="font-semibold">{module.title}</p>
                    <p className="text-sm text-gray-600">
                      {module.description}
                    </p>
                    {module.lessons && module.lessons.length > 0 && (
                      <ul className="list-circle mt-1 pl-5">
                        {module.lessons.map((lesson) => (
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
