import { useLocalParticipant } from "@livekit/components-react";
import React, { useEffect, useRef } from "react";

export default function RecordingManager({
  stopRef,
}: {
  stopRef: React.MutableRefObject<(() => Promise<Blob | null>) | null>;
}) {
  const { localParticipant } = useLocalParticipant();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start recording once both the camera and mic tracks are published.
  // Publishing is async (device init, permission prompts, simulcast
  // negotiation) so we retry on every publish event instead of guessing
  // a fixed delay - otherwise we can start recording audio-only.
  useEffect(() => {
    const tryStart = () => {
      if (recorderRef.current) return;

      const stream = new MediaStream();
      localParticipant.videoTrackPublications.forEach((pub) => {
        if (pub.track?.mediaStreamTrack)
          stream.addTrack(pub.track.mediaStreamTrack);
      });
      localParticipant.audioTrackPublications.forEach((pub) => {
        if (pub.track?.mediaStreamTrack)
          stream.addTrack(pub.track.mediaStreamTrack);
      });
      if (stream.getVideoTracks().length === 0) return;

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
    };

    tryStart();
    localParticipant.on("localTrackPublished", tryStart);
    return () => {
      localParticipant.off("localTrackPublished", tryStart);
    };
  }, [localParticipant]);

  // Expose stop function to parent via ref
  useEffect(() => {
    stopRef.current = () =>
      new Promise<Blob | null>((resolve) => {
        const recorder = recorderRef.current;
        if (!recorder || recorder.state === "inactive") return resolve(null);
        recorder.onstop = () => {
          resolve(new Blob(chunksRef.current, { type: "video/webm" }));
        };
        recorder.stop();
      });
  }, [stopRef]);

  return null;
}
