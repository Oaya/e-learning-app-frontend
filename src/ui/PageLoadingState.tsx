type PageLoadingStateProps = {
  message?: string;
};

export default function PageLoadingState({
  message = "Loading…",
}: PageLoadingStateProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
