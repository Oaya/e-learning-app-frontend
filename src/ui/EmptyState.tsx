import type { ReactNode } from "react";

type EmptyStateProps = {
  message: ReactNode;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty-state">{message}</div>;
}
