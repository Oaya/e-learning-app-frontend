type Props = {
  admin: {
    first_name: string;
    last_name: string;
    no_show_fee_percent: number;
    late_cancellation_fee_percent: number;
    cancellation_window_hours: number;
  };
};

export default function ({ admin }: Props) {
  return (
    <div className="panel-box">
      <p className="panel-header">Cancellation Policy</p>
      <div className="mt-1 divide-y divide-gray-100 text-sm">
        <div className="flex justify-between py-2.5">
          <span className="text-gray-500">Cancellation window</span>
          <span className="font-medium text-gray-700">
            {admin.cancellation_window_hours === 0
              ? "No policy"
              : `${admin.cancellation_window_hours} hours before lesson`}
          </span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-gray-500">Late cancellation fee</span>
          <span className="font-medium text-gray-700">
            {admin.late_cancellation_fee_percent === 0
              ? "No charge"
              : `${admin.late_cancellation_fee_percent}% of lesson rate`}
          </span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-gray-500">No-show fee</span>
          <span className="font-medium text-gray-700">
            {admin.no_show_fee_percent === 0
              ? "No charge"
              : `${admin.no_show_fee_percent}% of lesson rate`}
          </span>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-gray-400">
        Policy set by {admin.first_name} {admin.last_name}.
      </p>
    </div>
  );
}
