import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Create and deliver short, focused courses
        </h2>
        <p className="mb-10 max-w-xl text-gray-600">
          Build micro-courses with video lessons, quizzes, and progress tracking
          — all in one simple platform.
        </p>

        {/* Primary CTAs */}
        <div className="flex gap-6">
          {/* Admin flow */}
          <Link
            to="/signup"
            className="rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create a course
          </Link>

          {/* Student flow */}
          <Link
            to="/courses"
            className="rounded border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
          >
            Browse courses
          </Link>
        </div>
      </main>
      =
    </div>
  );
}
