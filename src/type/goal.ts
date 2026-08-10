export type GoalStatusType = "not_started" | "in_progress" | "achieved";

export type GoalActivity = {
  id: string;
  description: string;
  date?: string;
  progress: number;
  created_at: string;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  status: GoalStatusType;
  progress?: number;
  target_date?: string;
  achieved_at?: string;
  created_at: string;
  comments?: {
    id: string;
    comment: string;
    created_at: Date;
  }[];
  activities?: GoalActivity[];
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

export type UpsertGoalActivity = {
  activity_id?: string;
  description: string;
  date?: string;
  status: GoalStatusType;
  progress: number;
  achieved_at?: string;
};
