import React, { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";

export default function AiBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-purple-50 p-4">
      <div className="bg-theme-purple-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <HiOutlineSparkles className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-theme-purple-50 text-sm font-medium">
          Generate homework with AI
        </p>
        <p className="text-theme-purple-50 text-xs">
          Pick a student, topic and level — Claude will create tailored
          exercises in seconds.
        </p>
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-theme-purple-50 hover:bg-theme-purple-50/70 shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white"
      >
        Try it
      </button>
    </div>
  );
}
