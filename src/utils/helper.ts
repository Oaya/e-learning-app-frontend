import dayjs from "dayjs";

export function getVideoDuration(file: File): Promise<number> {
  const video = document.createElement("video");

  console.log("File received for duration calculation:", file);
  video.preload = "metadata";

  console.log("Starting to load video metadata for duration calculation.");
  console.log("Video element created:", video);

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = function () {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = function () {
      reject("Error loading video metadata");
    };
    video.src = URL.createObjectURL(file);
  });
}

export function capitalize(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

//Time Converter//
export function formatTime(iso: string) {
  return dayjs(iso).format("h:mm A");
}

export function formatDay(iso: string) {
  const d = dayjs(iso);
  return {
    day: d.date(),
    mon: d.format("MMM"),
  };
}
