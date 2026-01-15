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
