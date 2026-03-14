import { CheckCircle2, Clock } from "lucide-react";
import { PaymentStatus } from "../../backend";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusBadge({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  if (status === PaymentStatus.paid) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3" /> Paid
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 ${className}`}
    >
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}
