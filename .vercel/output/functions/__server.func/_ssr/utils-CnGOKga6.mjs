import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-CnGOKga6.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function iso(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") return value;
	if (value == null) return (/* @__PURE__ */ new Date()).toISOString();
	return String(value);
}
function parseJson(value, fallback) {
	if (value == null) return fallback;
	if (typeof value === "object") return value;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	return fallback;
}
function shortId(prefix = "") {
	const raw = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
	return prefix ? `${prefix}_${raw}` : raw;
}
function inviteCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "";
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % 32];
	return out;
}
//#endregion
export { shortId as a, parseJson as i, inviteCode as n, iso as r, cn as t };
