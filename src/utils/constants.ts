export const levels: { value: string; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all_levels", label: "All Levels" },
];

export const categories: { value: string; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
  { value: "it_software", label: "IT & Software" },
  { value: "personal_development", label: "Personal Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "photography", label: "Photography" },
  { value: "health_fitness", label: "Health & Fitness" },
  { value: "music", label: "Music" },
  { value: "teaching_academics", label: "Teaching & Academics" },
];

export const lessonTypes: string[] = ["video", "reading"];
export const roles = ["admin", "instructor", "student"] as const;
export type Role = (typeof roles)[number];
