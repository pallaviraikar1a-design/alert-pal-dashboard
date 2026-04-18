export type ExpiryStatus = "safe" | "expiring" | "expired";

export function getExpiryStatus(expiryDate: string, warnDays = 7): ExpiryStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= warnDays) return "expiring";
  return "safe";
}

export function daysUntil(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const statusLabel = (s: ExpiryStatus) =>
  ({ safe: "Safe", expiring: "Expiring", expired: "Expired" }[s]);

export const statusColor = (s: ExpiryStatus) =>
  ({
    safe: "bg-success/15 text-success border-success/30",
    expiring: "bg-warning/15 text-warning border-warning/30",
    expired: "bg-danger/15 text-danger border-danger/30",
  }[s]);
