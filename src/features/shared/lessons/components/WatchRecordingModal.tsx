import { HiOutlineX } from "react-icons/hi";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recordingUrl: string;
};

export default function WatchRecordingModal({
  isOpen,
  onClose,
  recordingUrl,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Lesson Recording
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <video
            src={recordingUrl}
            controls
            autoPlay
            className="max-h-[70vh] w-full rounded-lg bg-black"
          />
        </div>
      </div>
    </div>
  );
}
