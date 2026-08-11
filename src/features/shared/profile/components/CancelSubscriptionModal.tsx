import { useAlert } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../contexts/AuthContext";
import ModalShell from "../../../../ui/ModalShell";

type CancelSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
}: CancelSubscriptionModalProps) {
  const alert = useAlert();
  const { cancelSubscriptionPlan, isLoading } = useAuth();

  if (!isOpen) {
    return null;
  }

  const handleCancelSubscription = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      const res = await cancelSubscriptionPlan();

      console.log("Cancel subscription result:", res); // Debug log for cancel subscription result

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
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Subscription"
      maxWidth="max-w-2xl"
    >
      <div className="px-6 py-5">
        <p>Are you sure you want to cancel your subscription?</p>
        <p>
          This action cannot be undone. You will lose access to premium features
          at the end of your current billing cycle. If you change your mind, you
          can always resubscribe later.
        </p>
        <form onSubmit={handleCancelSubscription} className="my-6">
          <div className="modal-footer">
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
    </ModalShell>
  );
}
