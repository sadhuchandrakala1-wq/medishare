import { DollarSign, Tag, TrendingDown } from "lucide-react";
import {
  calculateFinalPrice,
  calculateSavings,
  formatCurrency,
} from "../../utils/helpers";

interface OrderSummaryProps {
  cost: bigint;
  discount: bigint;
}

export default function OrderSummary({ cost, discount }: OrderSummaryProps) {
  const finalPrice = calculateFinalPrice(cost, discount);
  const savings = calculateSavings(cost, discount);
  const hasDiscount = discount > 0n;

  return (
    <div className="bg-medical-light rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Tag className="w-4 h-4 text-primary" />
        Order Summary
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Original Price</span>
          <span className="font-medium">
            {cost === 0n ? "FREE" : formatCurrency(cost)}
          </span>
        </div>

        {hasDiscount && (
          <>
            <div className="flex justify-between text-accent">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Discount Applied
              </span>
              <span className="font-semibold">-{Number(discount)}%</span>
            </div>

            <div className="flex justify-between text-accent">
              <span>You Save</span>
              <span className="font-semibold">-{formatCurrency(savings)}</span>
            </div>
          </>
        )}

        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-bold text-foreground flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            Final Price
          </span>
          <span className="font-bold text-primary text-base">
            {finalPrice === 0n ? "FREE" : formatCurrency(finalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
