import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { b as ExternalLink } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/web-frame-BFvyfZYc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalizeUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	try {
		const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const u = new URL(withProto);
		if (u.protocol !== "http:" && u.protocol !== "https:") return null;
		return u.toString();
	} catch {
		return null;
	}
}
function WebFrame({ url }) {
	const href = (0, import_react.useMemo)(() => normalizeUrl(url), [url]);
	const [blocked, setBlocked] = (0, import_react.useState)(false);
	if (!href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-lift",
		children: "วางลิงก์เว็บที่ขึ้นต้นด้วย https"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl bg-surface shadow-lift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-muted",
				children: href
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), "เปิดแท็บใหม่"]
				})
			})]
		}), blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-10 text-center text-sm text-muted",
			children: "เว็บนี้ไม่อนุญาตให้ฝังในแอป กดเปิดแท็บใหม่แทน"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: "เว็บที่เปิด",
			src: href,
			className: "h-[62vh] w-full bg-surface",
			sandbox: "allow-scripts allow-same-origin allow-forms allow-popups",
			referrerPolicy: "no-referrer",
			onError: () => setBlocked(true)
		})]
	});
}
//#endregion
export { normalizeUrl as n, WebFrame as t };
