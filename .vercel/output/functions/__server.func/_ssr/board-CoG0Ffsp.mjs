import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as shortId, t as cn } from "./utils-CnGOKga6.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { a as StickyNote, c as PenLine, i as Trash2, m as Highlighter, n as Undo2, p as ImageDown, x as Eraser } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as saveDocument, a as getBoard, g as saveBoard, m as logBoardActivity, o as getBootstrap } from "./api-D3940rIG.mjs";
import { t as Skeleton } from "./skeleton-V11c_Ooo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-CoG0Ffsp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#111111",
	"#06C755",
	"#E11D48",
	"#2563EB",
	"#D97706"
];
function Whiteboard({ userId }) {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const drawing = (0, import_react.useRef)(null);
	const [tool, setTool] = (0, import_react.useState)("pen");
	const [color, setColor] = (0, import_react.useState)(COLORS[0]);
	const [strokes, setStrokes] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [stickyDraft, setStickyDraft] = (0, import_react.useState)(null);
	const [stickyText, setStickyText] = (0, import_react.useState)("");
	const hydrated = (0, import_react.useRef)(false);
	const dirty = (0, import_react.useRef)(false);
	const boardQ = useQuery({
		queryKey: ["board"],
		queryFn: () => getBoard(),
		refetchInterval: 2800
	});
	(0, import_react.useEffect)(() => {
		const data = boardQ.data;
		if (!data) return;
		if (drawing.current) return;
		if (!hydrated.current) {
			setStrokes(data.strokes);
			setNotes(data.notes);
			hydrated.current = true;
			return;
		}
		setStrokes((local) => mergeById(data.strokes, local));
		setNotes((local) => mergeById(data.notes, local));
	}, [boardQ.data]);
	const persist = useMutation({ mutationFn: (payload) => saveBoard({ data: payload }) });
	const flush = (0, import_react.useCallback)((nextStrokes, nextNotes) => {
		dirty.current = false;
		persist.mutate({
			strokes: nextStrokes,
			notes: nextNotes
		});
	}, [persist]);
	(0, import_react.useEffect)(() => {
		if (!hydrated.current) return;
		dirty.current = true;
		const t = window.setTimeout(() => flush(strokes, notes), 700);
		return () => window.clearTimeout(t);
	}, [
		strokes,
		notes,
		flush
	]);
	const paint = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#f7f8fa";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for (const s of strokes) drawStroke(ctx, s, canvas.width, canvas.height);
		if (drawing.current) drawStroke(ctx, drawing.current, canvas.width, canvas.height);
	}, [strokes]);
	(0, import_react.useEffect)(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const resize = () => {
			const rect = wrap.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(rect.width * dpr));
			canvas.height = Math.max(1, Math.floor(rect.height * dpr));
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;
			paint();
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(wrap);
		return () => ro.disconnect();
	}, [paint]);
	(0, import_react.useEffect)(() => {
		paint();
	}, [paint]);
	function normPoint(e) {
		const rect = canvasRef.current.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
	}
	function onPointerDown(e) {
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const p = normPoint(e);
		if (tool === "sticky") {
			setStickyDraft(p);
			setStickyText("");
			return;
		}
		drawing.current = {
			id: shortId("sk"),
			userId,
			tool: tool === "eraser" ? "eraser" : tool === "highlighter" ? "highlighter" : "pen",
			color: tool === "eraser" ? "#f7f8fa" : color,
			width: tool === "highlighter" ? 28 : tool === "eraser" ? 22 : 4,
			points: [p],
			t: Date.now()
		};
	}
	function onPointerMove(e) {
		if (!drawing.current) return;
		drawing.current.points.push(normPoint(e));
		paint();
	}
	function onPointerUp() {
		if (!drawing.current) return;
		const done = drawing.current;
		drawing.current = null;
		if (done.points.length < 1) return;
		setStrokes((prev) => [...prev, done]);
	}
	function undo() {
		setStrokes((prev) => {
			const idx = [...prev].reverse().findIndex((s) => s.userId === userId);
			if (idx < 0) return prev;
			const at = prev.length - 1 - idx;
			return prev.filter((_, i) => i !== at);
		});
	}
	function clearAll() {
		if (!window.confirm("ล้างบอร์ดทั้งแผ่น?")) return;
		setStrokes([]);
		setNotes([]);
		logBoardActivity({ data: { detail: "ล้างบอร์ด" } });
	}
	async function snapshot() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dataUrl = canvas.toDataURL("image/jpeg", .55);
		if (dataUrl.length > 85e4) {
			toast.error("ภาพบอร์ดใหญ่เกินไป ลองล้างบางส่วนก่อน");
			return;
		}
		try {
			await saveDocument({ data: {
				title: `บอร์ด ${(/* @__PURE__ */ new Date()).toLocaleString("th-TH")}`,
				kind: "image",
				content: dataUrl,
				mime: "image/jpeg"
			} });
			await logBoardActivity({ data: { detail: "บันทึกภาพบอร์ดเข้าลิ้นชัก" } });
			toast.success("เก็บภาพบอร์ดเข้าลิ้นชักแล้ว");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
		}
	}
	function addSticky() {
		if (!stickyDraft || !stickyText.trim()) {
			setStickyDraft(null);
			return;
		}
		setNotes((prev) => [...prev, {
			id: shortId("nt"),
			userId,
			x: stickyDraft.x,
			y: stickyDraft.y,
			text: stickyText.trim(),
			color: "#fff4b8",
			t: Date.now()
		}]);
		setStickyDraft(null);
		setStickyText("");
		setTool("pen");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-7.5rem)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 overflow-x-auto bg-surface px-2 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolBtn, {
					active: tool === "pen",
					onClick: () => setTool("pen"),
					label: "ปากกา",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolBtn, {
					active: tool === "highlighter",
					onClick: () => setTool("highlighter"),
					label: "เน้น",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighter, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolBtn, {
					active: tool === "eraser",
					onClick: () => setTool("eraser"),
					label: "ลบ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolBtn, {
					active: tool === "sticky",
					onClick: () => setTool("sticky"),
					label: "โน้ต",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-border" }),
				COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": c,
					onClick: () => {
						setColor(c);
						setTool("pen");
					},
					className: cn("size-8 shrink-0 rounded-full border-2", color === c && tool !== "eraser" ? "border-ink" : "border-transparent"),
					style: { background: c }
				}, c)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							onClick: undo,
							"aria-label": "เลิกทำ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							onClick: () => void snapshot(),
							"aria-label": "เก็บภาพ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDown, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							onClick: clearAll,
							"aria-label": "ล้างบอร์ด",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrapRef,
			className: "relative min-h-0 flex-1 touch-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "absolute inset-0 h-full w-full touch-none",
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onPointerCancel: onPointerUp
				}),
				notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute w-28 rounded-md p-2 text-xs shadow-lift",
					style: {
						left: `${n.x * 100}%`,
						top: `${n.y * 100}%`,
						background: n.color,
						transform: "translate(-10%, -10%)"
					},
					children: n.text
				}, n.id)),
				stickyDraft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute w-40 rounded-xl bg-sticky p-2 shadow-lift",
					style: {
						left: `${stickyDraft.x * 100}%`,
						top: `${stickyDraft.y * 100}%`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						autoFocus: true,
						value: stickyText,
						onChange: (e) => setStickyText(e.target.value),
						onBlur: addSticky,
						placeholder: "โน้ตสั้นๆ",
						className: "h-20 w-full resize-none bg-transparent text-sm outline-none"
					})
				}) : null
			]
		})]
	});
}
function ToolBtn({ active, onClick, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-11 min-w-11 shrink-0 flex-col items-center justify-center rounded-xl px-2 text-[10px]", active ? "bg-mint text-line-dark" : "text-muted"),
		children: [children, label]
	});
}
function drawStroke(ctx, s, w, h) {
	if (s.points.length === 0) return;
	ctx.save();
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.lineWidth = s.width * (w / 420);
	if (s.tool === "highlighter") {
		ctx.globalAlpha = .28;
		ctx.strokeStyle = s.color;
	} else if (s.tool === "eraser") {
		ctx.globalCompositeOperation = "destination-out";
		ctx.strokeStyle = "rgba(0,0,0,1)";
	} else ctx.strokeStyle = s.color;
	ctx.beginPath();
	ctx.moveTo(s.points[0].x * w, s.points[0].y * h);
	for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x * w, s.points[i].y * h);
	ctx.stroke();
	ctx.restore();
}
function mergeById(remote, local) {
	const map = /* @__PURE__ */ new Map();
	for (const item of remote) map.set(item.id, item);
	for (const item of local) map.set(item.id, item);
	return [...map.values()].sort((a, b) => a.t - b.t);
}
function BoardPage() {
	const bootQ = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	if (!bootQ.data?.me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[60vh] w-full" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Whiteboard, { userId: bootQ.data.me.id });
}
//#endregion
export { BoardPage as component };
