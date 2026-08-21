import HomeworkList from "@/features/admin/homework/components/HomeworkList";

export default function HomeworkPage() {
  return (
    <HomeworkList
      searchPlaceholder="Search student or task…"
      topBar={(openModal) => (
        <>
          <div>
            <h1 className="page-title">Homework</h1>
            <p className="mt-0.5 hidden text-sm text-gray-400 sm:block">
              Assign, track and review student homework
            </p>
          </div>
          <div className="flex gap-2">
            {/* <button
              onClick={openModal}
              className="btn-white flex items-center gap-1.5"
            >
              <HiOutlineSparkles size={16} /> Generate with AI
            </button> */}
            <button onClick={openModal} className="btn-primary-pink">
              + Assign Homework
            </button>
          </div>
        </>
      )}
    />
  );
}
