import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, MapPin, Package } from "lucide-react";
import { type Medicine, MedicineAvailability } from "../../backend";
import { calculateFinalPrice, formatCurrency } from "../../utils/helpers";
import DiscountBadge from "../shared/DiscountBadge";
import FreeBanner from "../shared/FreeBanner";

interface CustomerMedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
}

export default function CustomerMedicineCard({
  medicine,
  onClick,
}: CustomerMedicineCardProps) {
  const finalPrice = calculateFinalPrice(medicine.cost, medicine.discount);
  const isAvailable = medicine.availability === MedicineAvailability.available;
  const isFree = medicine.cost === 0n;

  const paymentLabel =
    medicine.paymentMode === "both"
      ? "Online / Offline"
      : medicine.paymentMode === "online"
        ? "Online"
        : "Offline";

  return (
    <Card
      onClick={isAvailable ? onClick : undefined}
      className={`rounded-2xl border border-border shadow-xs overflow-hidden transition-all ${
        isAvailable
          ? "cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
          : "opacity-60"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground">{medicine.name}</h3>
              {isFree ? (
                <FreeBanner />
              ) : medicine.discount > 0n ? (
                <DiscountBadge discount={medicine.discount} />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {medicine.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            {!isAvailable ? (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-500">
                Out of Stock
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                Available
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {!isFree && medicine.discount > 0n && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(medicine.cost)}
              </span>
            )}
            <span className="font-bold text-primary text-base">
              {isFree ? "FREE" : formatCurrency(finalPrice)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CreditCard className="w-3 h-3" />
            <span>{paymentLabel}</span>
          </div>
        </div>

        {medicine.locationAddress && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{medicine.locationAddress}</span>
          </div>
        )}

        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Package className="w-3 h-3 flex-shrink-0" />
          <span>By {medicine.senderName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
