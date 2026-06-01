"use client";

export type ConfirmAction = {
  title: string;
  desc?: string;
  detail?: string;
  onConfirm: () => void;
  danger?: boolean;
};

/**
 * Shared confirmation dialog. Supports an optional `desc` line (muted) and
 * an optional `detail` line (emphasized, turns red when danger).
 */
export default function ConfirmModal({
  action,
  onCancel,
}: {
  action: ConfirmAction | null;
  onCancel: () => void;
}) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-black text-gray-900">{action.title}</h3>
        {action.desc && (
          <p className="mt-2 text-sm text-gray-500">{action.desc}</p>
        )}
        {action.detail && (
          <p
            className={`mt-2 text-sm font-bold ${
              action.danger ? "text-red-600" : "text-gray-700"
            }`}
          >
            {action.detail}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={action.onConfirm}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-bold text-white transition ${
              action.danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-950 hover:bg-gray-800"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
