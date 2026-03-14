import { Card, CardContent } from "@/components/ui/card";
import { Package, Tag, User } from "lucide-react";
import { type OrderRecord, PaymentStatus } from "../../backend";
import {
  formatCurrency,
  formatDate,
  generateOrderDisplayId,
} from "../../utils/helpers";
import DiscountBadge from "../shared/DiscountBadge";
import PaymentStatusBadge from "../shared/PaymentStatusBadge";

interface CustomerOrderCardProps {
  order: OrderRecord;
}

export default function CustomerOrderCard({ order }: CustomerOrderCardProps) {
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
            <p className="text-xs text-muted-foreground font-mono">
              {generateOrderDisplayId(order.id)}
            </p>
          </div>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Sender: {order.medicineName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {order.discountPercentage > 0n ? (
                  <>
                    <span className="line-through text-xs mr-1">
                      {formatCurrency(order.originalCost)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(order.finalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-foreground">
                    {formatCurrency(order.finalPrice)}
                  </span>
                )}
              </span>
            </div>
            {order.discountPercentage > 0n && (
              <DiscountBadge discount={order.discountPercentage} />
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                order.paymentMode === "online"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {order.paymentMode === "online" ? "Online" : "Offline"} Payment
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
