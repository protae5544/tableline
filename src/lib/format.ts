export function relativeThai(isoDate: string): string {
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const min = Math.round(diff / 60000);
  if (min < 1) return "เมื่อกี้";
  if (min < 60) return `${min} นาทีที่แล้ว`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} ชม. ที่แล้ว`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} วันที่แล้ว`;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
  }).format(new Date(t));
}

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return Array.from(parts[0]!).slice(0, 2).join("");
  return `${Array.from(parts[0]!)[0] ?? ""}${Array.from(parts[1]!)[0] ?? ""}`;
}
