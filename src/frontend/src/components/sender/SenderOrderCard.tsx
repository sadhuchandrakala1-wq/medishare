import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Hash, Package, User } from "lucide-react";
import type { OrderRecord } from "../../backend";
import {
  formatCurrency,
  formatDate,
  generateOrderDisplayId,
} from "../../utils/helpers";
import PaymentStatusBadge from "../shared/PaymentStatusBadge";

interface SenderOrderCardProps {
  order: OrderRecord;
}

export default function SenderOrderCard({ order }: SenderOrderCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-xs overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="font-semibold text-foreground truncate">
                {order.medicineName}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Hash className="w-3 h-3" />
              <span>{generateOrderDisplayId(order.id)}</span>
            </div>
          </div>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{order.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">{formatDate(order.createdAt)}</span>
            </div>
            <div className="text-right">
              {order.discountPercentage > 0n && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCurrency(order.originalCost)}
                </p>
              )}
              <p className="font-bold text-primary">
                {formatCurrency(order.finalPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                order.status === "Pending"
                  ? "bg-orange-50 text-orange-600"
                  : order.status === "Confirmed"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-green-50 text-green-600"
              }`}
            >
              {order.status}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                order.paymentMode === "online"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {order.paymentMode === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
