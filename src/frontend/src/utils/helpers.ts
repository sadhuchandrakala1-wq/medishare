export function formatCurrency(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  if (num === 0) return "FREE";
  return `₹${num.toLocaleString("en-IN")}`;
}

export function calculateFinalPrice(cost: bigint, discount: bigint): bigint {
  if (discount <= 0n || discount > 100n) return cost;
  return cost - (cost * discount) / 100n;
}

export function calculateSavings(cost: bigint, discount: bigint): bigint {
  if (discount <= 0n || discount > 100n) return 0n;
  return (cost * discount) / 100n;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateOrderDisplayId(id: string): string {
  return id.slice(0, 16);
}
