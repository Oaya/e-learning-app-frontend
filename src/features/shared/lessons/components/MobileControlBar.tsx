import { useState } from "react";
import { Track } from "livekit-client";
import { TrackToggle, DisconnectButton } from "@livekit/components-react";
import {
  HiOutlineEllipsisHorizontal,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlinePhoneXMark,
  HiOutlineComputerDesktop,
} from "react-icons/hi2";
import { TbNotes } from "react-icons/tb";

type MobileControlBarProps = {
  notesOpen: boolean;
  onToggleNotes: () => void;
};

// VideoConference owns chat/settings toggle state internally and doesn't
// expose it to components rendered outside it, so we drive its real
// (CSS-hidden on mobile) buttons directly instead of duplicating state.
function clickControlBarButton(selector: string) {
  document
    .querySelector<HTMLButtonElement>(`.lesson-meeting-room .lk-control-bar ${selector}`)
    ?.click();
}

export default function MobileControlBar({
  notesOpen,
  onToggleNotes,
}: MobileControlBarProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div
          className="mobile-more-overlay"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="mobile-more-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <TrackToggle
              source={Track.Source.ScreenShare}
              className="mobile-more-item"
              onChange={() => setMoreOpen(false)}
            >
              <HiOutlineComputerDesktop size={20} />
              Share screen
            </TrackToggle>

            <button
              type="button"
              className="mobile-more-item"
              onClick={() => {
                clickControlBarButton(".lk-chat-toggle");
                setMoreOpen(false);
              }}
            >
              <HiOutlineChatBubbleLeftRight size={20} />
              Chat
            </button>

            <button
              type="button"
              className="mobile-more-item"
              onClick={() => {
                onToggleNotes();
                setMoreOpen(false);
              }}
            >
              <TbNotes size={20} />
              {notesOpen ? "Hide notes" : "Notes"}
            </button>

            <button
              type="button"
              className="mobile-more-item"
              onClick={() => {
                clickControlBarButton(".lk-settings-toggle");
                setMoreOpen(false);
              }}
            >
              <HiOutlineCog6Tooth size={20} />
              Settings
            </button>
          </div>
        </div>
      )}

      <div className="mobile-control-bar">
        <TrackToggle source={Track.Source.Microphone} className="mobile-bar-button" />
        <TrackToggle source={Track.Source.Camera} className="mobile-bar-button" />

        <button
          type="button"
          className="mobile-bar-button"
          aria-label="More options"
          onClick={() => setMoreOpen((p) => !p)}
        >
          <HiOutlineEllipsisHorizontal size={22} />
        </button>

        <DisconnectButton className="mobile-bar-button mobile-leave-button">
          <HiOutlinePhoneXMark size={20} />
        </DisconnectButton>
      </div>
    </>
  );
}
