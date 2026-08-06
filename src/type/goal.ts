export type GoalStatusType = "not_started" | "in_progress" | "achieved";

export type Goal = {
  id: string;
  title: string;
  description?: string;
  status: GoalStatusType;
  progress?: number;
  target_date?: string;
  achieved_at?: string;
  created_at: string;
};

export type UpsertGoal = {
  student_id: string;
  title: string;
  description?: string;
  status: GoalStatusType;
  progress?: number;
  target_date?: string;
  achieved_at?: string;
};
