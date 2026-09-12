//#region node_modules/.nitro/vite/services/ssr/assets/format-B2aNvbEh.js
function relativeThai(isoDate) {
	const t = new Date(isoDate).getTime();
	if (Number.isNaN(t)) return "";
	const diff = Date.now() - t;
	const min = Math.round(diff / 6e4);
	if (min < 1) return "เมื่อกี้";
	if (min < 60) return `${min} นาทีที่แล้ว`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `${hr} ชม. ที่แล้ว`;
	const day = Math.round(hr / 24);
	if (day < 7) return `${day} วันที่แล้ว`;
	return new Intl.DateTimeFormat("th-TH", {
		day: "numeric",
		month: "short"
	}).format(new Date(t));
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${m}-${day}`;
}
//#endregion
export { todayISO as n, relativeThai as t };
