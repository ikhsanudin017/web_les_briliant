import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function toInt(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function toBoolean(v: unknown, fallback = false) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return ["1", "true", "yes"].includes(v.toLowerCase());
  return fallback;
}

