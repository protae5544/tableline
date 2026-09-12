import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { t as Input } from "./input-ZyaFPzYi.mjs";
import { w as BookmarkPlus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Route$2 } from "./router-CQvOUc1D.mjs";
import { _ as saveDocument, d as listFolders } from "./api-D3940rIG.mjs";
import { n as normalizeUrl, t as WebFrame } from "./web-frame-BFvyfZYc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/web-BbGvz8wR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STARTERS = [
	{
		label: "Google Docs",
		url: "https://docs.google.com"
	},
	{
		label: "Google Drive",
		url: "https://drive.google.com"
	},
	{
		label: "LINE OA",
		url: "https://manager.line.biz"
	},
	{
		label: "Notion",
		url: "https://www.notion.so"
	}
];
function WebBrowser({ initialUrl = "" }) {
	const navigate = useNavigate();
	const [input, setInput] = (0, import_react.useState)(initialUrl);
	const [active, setActive] = (0, import_react.useState)(initialUrl);
	const href = (0, import_react.useMemo)(() => normalizeUrl(active), [active]);
	const foldersQ = useQuery({
		queryKey: ["folders"],
		queryFn: () => listFolders()
	});
	const save = useMutation({
		mutationFn: async () => {
			if (!href) throw new Error("ลิงก์ไม่ถูกต้อง");
			const folderId = foldersQ.data?.find((f) => f.name.includes("ลิงก์"))?.id ?? null;
			return saveDocument({ data: {
				folderId,
				title: href.replace(/^https?:\/\//, "").slice(0, 80),
				kind: "web",
				content: href,
				mime: "text/uri-list"
			} });
		},
		onSuccess: (res) => {
			toast.success("เก็บลิงก์เข้าลิ้นชักแล้ว");
			navigate({
				to: "/files/$docId",
				params: { docId: String(res.id) }
			});
		},
		onError: (err) => toast.error(err.message)
	});
	function go(raw = input) {
		const next = normalizeUrl(raw);
		if (!next) {
			toast.error("ใส่ลิงก์ให้ถูกต้อง");
			return;
		}
		setInput(next);
		setActive(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "เปิดเว็บทุกชนิด"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "วางลิงก์เอกสาร ชีต PDF หรืองานในไลน์ OA แล้วเก็บเข้าลิ้นชักได้"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					go();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "วางลิงก์ https://",
					inputMode: "url"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "เปิด"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-1.5 overflow-x-auto",
				children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => go(s.url),
					className: "h-9 shrink-0 rounded-full bg-surface px-3 text-xs font-medium shadow-lift",
					children: s.label
				}, s.url))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "w-full",
					disabled: !href || save.isPending,
					onClick: () => save.mutate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, {}), "เก็บลิงก์นี้เข้าลิ้นชัก"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebFrame, { url: active })
			})
		]
	});
}
function WebPage() {
	const { url } = Route$2.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebBrowser, { initialUrl: url ?? "" });
}
//#endregion
export { WebPage as component };
