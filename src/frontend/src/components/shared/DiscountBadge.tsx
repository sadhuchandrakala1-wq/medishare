interface DiscountBadgeProps {
  discount: bigint | number;
  className?: string;
}

export default function DiscountBadge({
  discount,
  className = "",
}: DiscountBadgeProps) {
  const value = typeof discount === "bigint" ? Number(discount) : discount;
  if (value <= 0) return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-accent text-white ${className}`}
    >
      -{value}%
    </span>
  );
}
