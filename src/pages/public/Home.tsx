import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Create and deliver short, focused courses
        </h2>
        <p className="mb-10 max-w-xl text-gray-600">
          Build micro-courses with video lessons, quizzes, and progress tracking
          — all in one simple platform.
        </p>

        <div className="flex gap-6">
          <Link
            to="/signup"
            className="bg-dark-purple hover:bg-dark-purple/80 rounded px-6 py-3 font-medium text-white"
          >
            Create a course
          </Link>
        </div>
      </main>
      =
    </div>
  );
}
