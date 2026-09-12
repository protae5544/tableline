import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-CnGOKga6.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { C as Check, S as Copy, o as Send } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line-share-CnZ6P1pS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** LINE URL scheme that opens the share composer with pre-filled text. */
function lineTextShareUrl(text) {
	return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}
function openLineShare(text) {
	const url = lineTextShareUrl(text);
	window.open(url, "_blank", "noopener,noreferrer");
}
async function copyText(text) {
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
function inviteLineText(workspaceName, code) {
	return [
		`เชิญเข้าห้องงาน「${workspaceName}」ในไลน์โต๊ะ`,
		"",
		`รหัสเข้าห้อง: ${code}`,
		"",
		"เปิดแอปแล้วกดเข้าร่วมด้วยรหัสนี้",
		"ห้องนี้รับได้แค่ 2 คน — สำหรับคู่ทำงานที่ต้องส่งงานเข้าไลน์"
	].join("\n");
}
function reportToLineText(report, authorName) {
	const statusLabel = {
		done: "เสร็จ",
		doing: "ทำอยู่",
		blocked: "ติดปัญหา",
		wait: "รอ"
	};
	const lines = [
		`รายงานงาน ${formatThaiDate(report.workDate)}`,
		`เรื่อง: ${report.title}`,
		`จาก: ${authorName}`,
		"----------"
	];
	for (const item of report.items) {
		const extra = item.note ? ` — ${item.note}` : "";
		lines.push(`[${statusLabel[item.status]}] ${item.task}${extra}`);
	}
	if (report.summary) lines.push("----------", `สรุป: ${report.summary}`);
	if (report.nextPlan) lines.push(`งานถัดไป: ${report.nextPlan}`);
	if (report.hours) lines.push(`ชั่วโมง: ${report.hours}`);
	lines.push("----------", "ส่งจากไลน์โต๊ะ");
	return lines.join("\n");
}
function dailyDigestLineText(opts) {
	return [
		`สรุปห้อง「${opts.workspaceName}」`,
		`จาก: ${opts.authorName}`,
		opts.partnerName ? `คู่หู: ${opts.partnerName}` : "ยังรอคู่หูเข้าห้อง",
		"----------",
		`ไฟล์ในลิ้นชัก: ${opts.files}`,
		`ข้อความวันนี้ในห้อง: ${opts.messages}`,
		`รายงาน: ${opts.reports}`,
		"----------",
		"ส่งจากไลน์โต๊ะ — กดเปิดห้องเพื่อดูรายละเอียด"
	].join("\n");
}
function formatThaiDate(isoDate) {
	const d = /* @__PURE__ */ new Date(isoDate + (isoDate.length <= 10 ? "T00:00:00" : ""));
	if (Number.isNaN(d.getTime())) return isoDate;
	return new Intl.DateTimeFormat("th-TH", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(d);
}
var QUICK_PHRASES = [
	"รับทราบครับ",
	"รับทราบค่ะ",
	"กำลังดำเนินการ",
	"ส่งรายงานแล้วครับ",
	"ส่งรายงานแล้วค่ะ",
	"รอคอนเฟิร์มจากหัวหน้า",
	"นัดเปิดบอร์ดคุยกัน",
	"เก็บไฟล์เข้าลิ้นชักแล้ว"
];
function LineShareActions({ text, compact = false, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function onCopy() {
		if (await copyText(text)) {
			setCopied(true);
			toast.success("คัดลอกแล้ว วางในไลน์ได้เลย");
			window.setTimeout(() => setCopied(false), 1600);
		} else toast.error("คัดลอกไม่สำเร็จ");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			size: compact ? "sm" : "default",
			className: "flex-1",
			onClick: () => openLineShare(text),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), "ส่งเข้าไลน์"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			size: compact ? "sm" : "default",
			className: "flex-1",
			onClick: () => void onCopy(),
			children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ"]
		})]
	});
}
//#endregion
export { inviteLineText as a, formatThaiDate as i, QUICK_PHRASES as n, reportToLineText as o, dailyDigestLineText as r, LineShareActions as t };
