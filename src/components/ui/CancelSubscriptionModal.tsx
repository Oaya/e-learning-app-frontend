import { AiOutlineClose } from "react-icons/ai";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";

type CancelSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
}: CancelSubscriptionModalProps) {
  const alert = useAlert();
  const { cancelTenantSubscription, isLoading } = useAuth();

  if (!isOpen) {
    return null;
  }

  const handleCancelSubscription = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      const res = await cancelTenantSubscription();

      if (res.success) {
        alert.success(res.data.message);
        onClose();
      } else {
        alert.error(
          res.error || "Failed to cancel subscription. Try again later.",
        );
      }
    } catch (err) {
      alert.error("Failed to cancel subscription. Try again later.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Cancel Subscription</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        <p>
          Are you sure you want to cancel your subscription? This action cannot
          be undone. You will lose access to premium features at the end of your
          current billing cycle. If you change your mind, you can always
          resubscribe later.
        </p>
        <form onSubmit={handleCancelSubscription} className="my-6">
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              className="btn-primary-pink"
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
