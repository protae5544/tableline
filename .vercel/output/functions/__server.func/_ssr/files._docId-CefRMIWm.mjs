import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { t as Input } from "./input-ZyaFPzYi.mjs";
import { T as ArrowLeft, i as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as Route$1 } from "./router-CQvOUc1D.mjs";
import { _ as saveDocument, c as getDocument, r as deleteDocument } from "./api-D3940rIG.mjs";
import { t as Skeleton } from "./skeleton-V11c_Ooo.mjs";
import { t as LineShareActions } from "./line-share-CnZ6P1pS.mjs";
import { t as Textarea } from "./textarea-Cok6x0nY.mjs";
import { t as WebFrame } from "./web-frame-BFvyfZYc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/files._docId-CefRMIWm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocViewer({ docId }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["doc", docId],
		queryFn: () => getDocument({ data: { id: docId } })
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!q.data) return;
		setTitle(q.data.title);
		setContent(q.data.content);
	}, [q.data]);
	const save = useMutation({
		mutationFn: () => saveDocument({ data: {
			id: docId,
			title: title.trim() || "ไม่มีชื่อ",
			kind: q.data?.kind ?? "note",
			content,
			mime: q.data?.mime ?? null
		} }),
		onSuccess: async () => {
			toast.success("บันทึกแล้ว");
			await qc.invalidateQueries({ queryKey: ["doc", docId] });
			await qc.invalidateQueries({ queryKey: ["docs"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const remove = useMutation({
		mutationFn: () => deleteDocument({ data: { id: docId } }),
		onSuccess: async () => {
			toast.success("ลบแล้ว");
			await qc.invalidateQueries({ queryKey: ["docs"] });
			await navigate({ to: "/files" });
		}
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-64 w-full" })]
	});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ไม่พบเอกสาร" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/files",
			className: "mt-3 inline-block text-line",
			children: "กลับลิ้นชัก"
		})]
	});
	const doc = q.data;
	const shareText = `${doc.title}\n\n${doc.kind === "web" ? doc.content : doc.content.slice(0, 1800)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => void navigate({ to: "/files" }),
						"aria-label": "กลับ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "font-medium"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": "ลบ",
						onClick: () => {
							if (window.confirm("ลบเอกสารนี้?")) remove.mutate();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					})
				]
			}),
			doc.kind === "web" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: content,
					onChange: (e) => setContent(e.target.value),
					inputMode: "url"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebFrame, { url: content })]
			}) : doc.kind === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: content,
				alt: title,
				className: "w-full rounded-2xl bg-surface object-contain"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: content,
				onChange: (e) => setContent(e.target.value),
				className: "min-h-[50vh] font-mono text-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [doc.kind !== "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: save.isPending,
					onClick: () => save.mutate(),
					children: save.isPending ? "กำลังบันทึก..." : "บันทึก"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions, { text: shareText })]
			})
		]
	});
}
function DocPage() {
	const { docId } = Route$1.useParams();
	const id = Number(docId);
	if (!Number.isFinite(id)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-6",
		children: "ลิงก์เอกสารไม่ถูกต้อง"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocViewer, { docId: id });
}
//#endregion
export { DocPage as component };
