import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  useLocalParticipant,
  useLayoutContext,
  useTranscriptions,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, VideoPresets, type RoomOptions } from "livekit-client";
import {
  BackgroundProcessor,
  supportsBackgroundProcessors,
} from "@livekit/track-processors";
import { joinLesson } from "../../../../api/lessons";
import "../../../../styles/lesson-meeting.css";

type RoomData = {
  token: string;
  url: string;
};

const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: VideoPresets.h1080.resolution,
  },
  publishDefaults: {
    videoSimulcastLayers: [
      VideoPresets.h360,
      VideoPresets.h720,
      VideoPresets.h1080,
    ],
    dtx: true,
    red: true,
  },
};

function MeetingSettings() {
  const { localParticipant } = useLocalParticipant();
  const { dispatch, state } = useLayoutContext().widget;
  const supported = useMemo(() => supportsBackgroundProcessors(), []);
  const [blurred, setBlurred] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!state?.showSettings) return;

    const closeIfOutside = (e: MouseEvent) => {
      const panel = document.querySelector(".lk-settings-menu-modal");
      const toggle = document.querySelector(".lk-settings-toggle");
      const target = e.target as Node;
      if (panel?.contains(target) || toggle?.contains(target)) return;
      dispatch?.({ msg: "toggle_settings" });
    };

    document.addEventListener("mousedown", closeIfOutside);
    return () => document.removeEventListener("mousedown", closeIfOutside);
  }, [state?.showSettings, dispatch]);

  const applyProcessor = useCallback(
    async (on: boolean) => {
      const track = localParticipant.getTrackPublication(
        Track.Source.Camera,
      )?.videoTrack;
      if (!track) return;

      if (on) {
        await track.setProcessor(
          BackgroundProcessor({ mode: "background-blur", blurRadius: 30 }),
        );
      } else {
        await track.stopProcessor();
      }
    },
    [localParticipant],
  );

  // Camera tracks are recreated when the camera is toggled off/on, so re-apply
  // the blur processor to whichever track is currently published.
  useEffect(() => {
    if (!blurred) return;

    const reapply = (publication: { source: Track.Source }) => {
      if (publication.source === Track.Source.Camera) applyProcessor(true);
    };

    localParticipant.on("localTrackPublished", reapply);
    return () => {
      localParticipant.off("localTrackPublished", reapply);
    };
  }, [blurred, localParticipant, applyProcessor]);

  if (!supported) {
    return (
      <div className="meeting-settings-panel">
        <p className="meeting-settings-title">Background</p>
        <p className="meeting-settings-hint">
          Background blur isn&apos;t supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="meeting-settings-panel">
      <p className="meeting-settings-title">Background</p>
      <button
        type="button"
        className="meeting-settings-toggle"
        aria-pressed={blurred}
        disabled={pending}
        onClick={async () => {
          const next = !blurred;
          setPending(true);
          try {
            await applyProcessor(next);
            setBlurred(next);
          } finally {
            setPending(false);
          }
        }}
      >
        <p>Blur: </p>
        <p> {blurred ? "On" : "Off"}</p>
      </button>
    </div>
  );
}

// Renders live captions from LiveKit text streams. Requires a transcription
// source publishing to the room (e.g. a LiveKit Agent with an STT plugin) —
// this component only displays what's already on the room's text stream.
function LiveCaptions() {
  const transcriptions = useTranscriptions();
  const lines = transcriptions.slice(-3);

  if (lines.length === 0) return null;

  return (
    <div className="lesson-captions">
      {lines.map((line) => (
        <p key={line.streamInfo.id} className="lesson-captions-line">
          <span className="lesson-captions-speaker">
            {line.participantInfo.identity}:
          </span>{" "}
          {line.text}
        </p>
      ))}
    </div>
  );
}

export default function LessonMeetingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;

      const res = await joinLesson(id);

      if (res.error) {
        setError("Could not join lesson.");
        return;
      }

      setRoomData(res.data);
    };

    fetchRoomData();
  }, [id]);

  if (error) {
    return (
      <div className="meeting-status-screen">
        <p className="meeting-status-error">{error}</p>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="meeting-status-screen">
        <p className="meeting-status-text">Joining lesson...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      className="lesson-meeting-room"
      token={roomData.token}
      serverUrl={roomData.url}
      connect={true}
      video={true}
      audio={true}
      options={roomOptions}
      onDisconnected={() => navigate(-1)}
    >
      <VideoConference SettingsComponent={MeetingSettings} />
      <LiveCaptions />
    </LiveKitRoom>
  );
}
