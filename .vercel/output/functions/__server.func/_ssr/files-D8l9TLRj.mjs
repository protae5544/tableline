import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cn } from "./utils-CnGOKga6.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { t as Input } from "./input-ZyaFPzYi.mjs";
import { t as Label } from "./label-pv-XhmAs.mjs";
import { a as StickyNote, f as Image, g as FolderPlus, h as Globe, s as Plus, t as X, u as Link2, v as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as saveDocument, d as listFolders, t as createFolder, u as listDocuments } from "./api-D3940rIG.mjs";
import { t as Skeleton } from "./skeleton-V11c_Ooo.mjs";
import { t as relativeThai } from "./format-B2aNvbEh.mjs";
import { t as Textarea } from "./textarea-Cok6x0nY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/files-D8l9TLRj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl bg-surface p-5 text-ink shadow-lift duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted hover:bg-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "ปิด"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function FileDrawer() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [folderId, setFolderId] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [folderOpen, setFolderOpen] = (0, import_react.useState)(false);
	const foldersQ = useQuery({
		queryKey: ["folders"],
		queryFn: () => listFolders()
	});
	const docsQ = useQuery({
		queryKey: ["docs", folderId],
		queryFn: () => listDocuments({ data: { folderId: folderId === "all" ? null : folderId } })
	});
	const docs = docsQ.data ?? [];
	const folders = foldersQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "ลิ้นชักเอกสาร"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "เก็บโน้ต ลิงก์เว็บ รูป และไฟล์ แล้วเปิดได้ทันที"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "outline",
						onClick: () => setFolderOpen(true),
						"aria-label": "ลิ้นชักใหม่",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						onClick: () => setCreateOpen(true),
						"aria-label": "สร้างเอกสาร",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mx-1 mb-4 flex gap-1.5 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: folderId === "all",
					onClick: () => setFolderId("all"),
					children: "ทั้งหมด"
				}), folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: folderId === f.id,
					onClick: () => setFolderId(f.id),
					children: [
						f.name,
						" ",
						f.docCount
					]
				}, f.id))]
			}),
			docsQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" })]
			}) : docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyFiles, { onCreate: () => setCreateOpen(true) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: docs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/files/$docId",
						params: { docId: String(doc.id) }
					}),
					className: "flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-xl bg-mint text-line-dark",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindIcon, { kind: doc.kind })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: doc.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-muted",
							children: [
								kindLabel(doc.kind),
								" · ",
								doc.authorName,
								" · ",
								relativeThai(doc.updatedAt)
							]
						})]
					})]
				}) }, doc.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateDocDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				folders,
				defaultFolderId: folderId === "all" ? folders[0]?.id : folderId,
				onCreated: (id) => {
					qc.invalidateQueries({ queryKey: ["docs"] });
					qc.invalidateQueries({ queryKey: ["folders"] });
					navigate({
						to: "/files/$docId",
						params: { docId: String(id) }
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateFolderDialog, {
				open: folderOpen,
				onOpenChange: setFolderOpen,
				onCreated: () => {
					qc.invalidateQueries({ queryKey: ["folders"] });
				}
			})
		]
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium", active ? "bg-line text-on-line" : "bg-surface text-muted shadow-lift"),
		children
	});
}
function KindIcon({ kind }) {
	if (kind === "web") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-5" });
	if (kind === "image") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-5" });
	if (kind === "board") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-5" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" });
}
function kindLabel(kind) {
	return {
		note: "โน้ต",
		web: "เว็บ",
		image: "รูป",
		file: "ไฟล์",
		board: "บอร์ด"
	}[kind];
}
function EmptyFiles({ onCreate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-5 py-10 text-center shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "ลิ้นชักนี้ยังว่าง"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "สร้างโน้ต วางลิงก์เว็บ หรืออัปโหลดไฟล์ได้เลย"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: onCreate,
				children: "สร้างเอกสาร"
			})
		]
	});
}
function CreateFolderDialog({ open, onOpenChange, onCreated }) {
	const [name, setName] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: () => createFolder({ data: { name } }),
		onSuccess: () => {
			toast.success("สร้างลิ้นชักแล้ว");
			setName("");
			onOpenChange(false);
			onCreated();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "ลิ้นชักใหม่" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "แยกเอกสารตามงาน เช่น ของเจ้านาย หรือของลูกค้า" })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "folder-name",
				children: "ชื่อลิ้นชัก"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "folder-name",
				value: name,
				onChange: (e) => setName(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: !name.trim() || mut.isPending,
				onClick: () => mut.mutate(),
				children: "สร้าง"
			})
		] })
	});
}
function CreateDocDialog({ open, onOpenChange, folders, defaultFolderId, onCreated }) {
	const [kind, setKind] = (0, import_react.useState)("note");
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [folderId, setFolderId] = (0, import_react.useState)(defaultFolderId);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const kinds = (0, import_react.useMemo)(() => [
		{
			id: "note",
			label: "โน้ต",
			icon: FileText
		},
		{
			id: "web",
			label: "ลิงก์เว็บ",
			icon: Link2
		},
		{
			id: "file",
			label: "ไฟล์ข้อความ",
			icon: FileText
		},
		{
			id: "image",
			label: "รูป",
			icon: Image
		}
	], []);
	async function create() {
		setBusy(true);
		try {
			const res = await saveDocument({ data: {
				folderId: folderId ?? null,
				title: title.trim() || (kind === "web" ? content : "ไม่มีชื่อ"),
				kind,
				content: content.trim(),
				mime: kind === "web" ? "text/uri-list" : "text/plain"
			} });
			toast.success("เก็บเข้าลิ้นชักแล้ว");
			setTitle("");
			setContent("");
			onOpenChange(false);
			onCreated(res.id);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
		} finally {
			setBusy(false);
		}
	}
	async function onFile(file) {
		setBusy(true);
		try {
			if (file.size > 7e5) {
				toast.error("ไฟล์ใหญ่เกิน 700KB — วางลิงก์แทน");
				return;
			}
			const isImage = file.type.startsWith("image/");
			const textLike = file.type.startsWith("text/") || /\.(txt|md|csv|json|html|xml)$/i.test(file.name);
			let body = "";
			let nextKind = "file";
			let mime = file.type || "application/octet-stream";
			if (isImage) {
				body = await readDataUrl(file);
				nextKind = "image";
			} else if (textLike) {
				body = await file.text();
				nextKind = "file";
			} else {
				toast.error("เปิดชนิดนี้ในแอปไม่ได้โดยตรง — วางลิงก์เว็บของไฟล์แทน");
				return;
			}
			const res = await saveDocument({ data: {
				folderId: folderId ?? null,
				title: title.trim() || file.name,
				kind: nextKind,
				content: body,
				mime
			} });
			toast.success("เก็บไฟล์แล้ว");
			onOpenChange(false);
			onCreated(res.id);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "สร้างหรือเก็บเอกสาร" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "โน้ต ลิงก์เว็บ รูป หรือไฟล์ข้อความ" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: kinds.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setKind(k.id),
						className: cn("flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium", kind === k.id ? "bg-mint text-line-dark" : "bg-page text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "size-4" }), k.label]
					}, k.id))
				}),
				folders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "doc-folder",
					children: "ลิ้นชัก"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "doc-folder",
					className: "mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3",
					value: folderId ?? "",
					onChange: (e) => setFolderId(e.target.value ? Number(e.target.value) : void 0),
					children: folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: f.id,
						children: f.name
					}, f.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "doc-title",
					children: "ชื่อ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "doc-title",
					className: "mt-1.5",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "ชื่องาน"
				})] }),
				kind === "image" || kind === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "doc-file",
					children: "เลือกไฟล์จากเครื่อง"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "doc-file",
					className: "mt-1.5",
					type: "file",
					accept: kind === "image" ? "image/*" : "*/*",
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (file) onFile(file);
					}
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "doc-body",
					children: kind === "web" ? "ลิงก์เว็บ" : "เนื้อหา"
				}), kind === "web" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "doc-body",
					className: "mt-1.5",
					value: content,
					onChange: (e) => setContent(e.target.value),
					placeholder: "https://",
					inputMode: "url"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "doc-body",
					className: "mt-1.5",
					value: content,
					onChange: (e) => setContent(e.target.value),
					placeholder: "พิมพ์โน้ต"
				})] }),
				kind === "note" || kind === "web" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => void create(),
					children: busy ? "กำลังเก็บ..." : "เก็บเข้าลิ้นชัก"
				}) : null
			]
		})
	});
}
function readDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("อ่านไฟล์ไม่สำเร็จ"));
		reader.readAsDataURL(file);
	});
}
function FilesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDrawer, {});
}
//#endregion
export { FilesPage as component };
