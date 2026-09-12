import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-CnGOKga6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-MSOoJdnq.js
var import_jsx_runtime = require_jsx_runtime();
function LineTohMark({ className, inverse = false }) {
	const bg = inverse ? "#ffffff" : "#06C755";
	const fg = inverse ? "#06C755" : "#ffffff";
	const line = inverse ? "#ffffff" : "#06C755";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "10",
				fill: bg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 12.2c0-2.4 2.4-4.4 8-4.4s8 2 8 4.4v5.1c0 2.4-2.4 4.4-8 4.4-.7 0-1.4 0-2-.1L9.6 24.2c-.4.2-.8-.2-.7-.6l.7-2.4C8.6 20.3 8 19 8 17.3z",
				fill: fg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12",
				y: "13.2",
				width: "8",
				height: "1.4",
				rx: "0.7",
				fill: line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12",
				y: "16.2",
				width: "5.2",
				height: "1.4",
				rx: "0.7",
				fill: line
			})
		]
	});
}
//#endregion
export { LineTohMark as t };
