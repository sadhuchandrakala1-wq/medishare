import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Edit2, Hash, Trash2 } from "lucide-react";
import { type Medicine, MedicineAvailability } from "../../backend";
import { formatCurrency, generateOrderDisplayId } from "../../utils/helpers";
import DiscountBadge from "../shared/DiscountBadge";
import FreeBanner from "../shared/FreeBanner";

interface SenderMedicineCardProps {
  medicine: Medicine;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (available: boolean) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function SenderMedicineCard({
  medicine,
  onEdit,
  onDelete,
  onToggleAvailability,
  isUpdating,
  isDeleting,
}: SenderMedicineCardProps) {
  const isAvailable = medicine.availability === MedicineAvailability.available;
  const isFree = medicine.cost === 0n;

  return (
    <Card className="rounded-2xl border border-border shadow-xs overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground">{medicine.name}</h3>
              {isFree ? (
                <FreeBanner />
              ) : medicine.discount > 0n ? (
                <DiscountBadge discount={medicine.discount} />
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Hash className="w-3 h-3" />
              <span>{generateOrderDisplayId(medicine.id)}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="w-8 h-8 rounded-xl hover:bg-primary/10 hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-8 h-8 rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-bold text-primary">
                {isFree ? "FREE" : formatCurrency(medicine.cost)}
              </p>
            </div>
            {!isFree && medicine.discount > 0n && (
              <div>
                <p className="text-xs text-muted-foreground">Discount</p>
                <p className="font-semibold text-accent">
                  {Number(medicine.discount)}% off
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${isAvailable ? "text-green-600" : "text-red-500"}`}
            >
              {isAvailable ? "Available" : "Out of Stock"}
            </span>
            <Switch
              checked={isAvailable}
              onCheckedChange={onToggleAvailability}
              disabled={isUpdating}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
