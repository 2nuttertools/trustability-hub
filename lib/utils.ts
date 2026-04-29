import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "THB" | "CNY" | "USD" = "THB") {
  if (currency === "THB") {
    if (price >= 1_000_000) return `฿${(price / 1_000_000).toFixed(2)}M`;
    if (price >= 1_000) return `฿${(price / 1_000).toFixed(0)}K`;
    return `฿${price.toLocaleString()}`;
  }
  if (currency === "CNY") {
    return `¥${(price * 0.21).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return `$${(price * 0.029).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatPriceFull(price: number) {
  return `฿${price.toLocaleString()}`;
}
