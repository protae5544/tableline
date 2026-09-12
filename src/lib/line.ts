import type { Report } from "./types";

/** LINE URL scheme that opens the share composer with pre-filled text. */
export function lineTextShareUrl(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

export function openLineShare(text: string): void {
  const url = lineTextShareUrl(text);
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

export function inviteLineText(workspaceName: string, code: string): string {
  return [
    `เชิญเข้าห้องงาน「${workspaceName}」ในไลน์โต๊ะ`,
    "",
    `รหัสเข้าห้อง: ${code}`,
    "",
    "เปิดแอปแล้วกดเข้าร่วมด้วยรหัสนี้",
    "ห้องนี้รับได้แค่ 2 คน — สำหรับคู่ทำงานที่ต้องส่งงานเข้าไลน์",
  ].join("\n");
}

export function reportToLineText(report: Report, authorName: string): string {
  const statusLabel: Record<Report["items"][number]["status"], string> = {
    done: "เสร็จ",
    doing: "ทำอยู่",
    blocked: "ติดปัญหา",
    wait: "รอ",
  };
  const lines = [
    `รายงานงาน ${formatThaiDate(report.workDate)}`,
    `เรื่อง: ${report.title}`,
    `จาก: ${authorName}`,
    "----------",
  ];
  for (const item of report.items) {
    const extra = item.note ? ` — ${item.note}` : "";
    lines.push(`[${statusLabel[item.status]}] ${item.task}${extra}`);
  }
  if (report.summary) {
    lines.push("----------", `สรุป: ${report.summary}`);
  }
  if (report.nextPlan) {
    lines.push(`งานถัดไป: ${report.nextPlan}`);
  }
  if (report.hours) {
    lines.push(`ชั่วโมง: ${report.hours}`);
  }
  lines.push("----------", "ส่งจากไลน์โต๊ะ");
  return lines.join("\n");
}

export function dailyDigestLineText(opts: {
  workspaceName: string;
  authorName: string;
  files: number;
  messages: number;
  reports: number;
  partnerName: string | null;
}): string {
  return [
    `สรุปห้อง「${opts.workspaceName}」`,
    `จาก: ${opts.authorName}`,
    opts.partnerName ? `คู่หู: ${opts.partnerName}` : "ยังรอคู่หูเข้าห้อง",
    "----------",
    `ไฟล์ในลิ้นชัก: ${opts.files}`,
    `ข้อความวันนี้ในห้อง: ${opts.messages}`,
    `รายงาน: ${opts.reports}`,
    "----------",
    "ส่งจากไลน์โต๊ะ — กดเปิดห้องเพื่อดูรายละเอียด",
  ].join("\n");
}

export function formatThaiDate(isoDate: string): string {
  const d = new Date(isoDate + (isoDate.length <= 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return isoDate;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const QUICK_PHRASES = [
  "รับทราบครับ",
  "รับทราบค่ะ",
  "กำลังดำเนินการ",
  "ส่งรายงานแล้วครับ",
  "ส่งรายงานแล้วค่ะ",
  "รอคอนเฟิร์มจากหัวหน้า",
  "นัดเปิดบอร์ดคุยกัน",
  "เก็บไฟล์เข้าลิ้นชักแล้ว",
] as const;
