import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./_ssr/utils-CnGOKga6.mjs";
import { t as LineTohMark$1 } from "./_ssr/logo-MSOoJdnq.mjs";
import { t as Button } from "./_ssr/button-BaQfuajX.mjs";
import { t as Input } from "./_ssr/input-ZyaFPzYi.mjs";
import { t as Label } from "./_ssr/label-pv-XhmAs.mjs";
import { _ as FolderOpen, c as PenLine, d as KeyRound, h as Globe, l as MessageCircle, s as Plus, y as FileChartColumnIncreasing } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { h as renameMe, l as joinWorkspace, n as createWorkspace, o as getBootstrap } from "./_ssr/api-D3940rIG.mjs";
import { t as Skeleton } from "./_ssr/skeleton-V11c_Ooo.mjs";
import { n as useCurrentUserState } from "./_ssr/use-current-user-DG6UNzh9.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-BXDb0caV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BkFj1Igz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/",
		label: "แชท",
		icon: MessageCircle,
		match: (p) => p === "/"
	},
	{
		to: "/board",
		label: "บอร์ด",
		icon: PenLine,
		match: (p) => p.startsWith("/board")
	},
	{
		to: "/files",
		label: "ลิ้นชัก",
		icon: FolderOpen,
		match: (p) => p.startsWith("/files")
	},
	{
		to: "/reports",
		label: "รายงาน",
		icon: FileChartColumnIncreasing,
		match: (p) => p.startsWith("/reports")
	},
	{
		to: "/web",
		label: "เว็บ",
		icon: Globe,
		match: (p) => p.startsWith("/web")
	}
];
function AppShell({ workspace, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-page md:max-w-3xl lg:max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center gap-3 bg-line px-4 text-on-line",
				style: { paddingTop: "max(0.75rem, env(safe-area-inset-top))" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineTohMark, {
						className: "size-8",
						inverse: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[15px] font-semibold leading-tight",
							children: workspace?.name ?? "ไลน์โต๊ะ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-on-line/80",
							children: workspace?.partner ? `คู่หู ${workspace.partner.name}` : workspace ? "รอคู่หูเข้าห้อง" : "ห้องงานสองคน"
						})]
					}),
					workspace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-on-line/15 px-2.5 py-1 font-mono text-[11px] tracking-wide",
						children: workspace.inviteCode
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative min-h-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-lg border-t border-border bg-surface md:max-w-3xl lg:max-w-5xl",
				style: { paddingBottom: "env(safe-area-inset-bottom)" },
				children: TABS.map((tab) => {
					const active = tab.match(pathname);
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-line" : "text-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: active ? 2.4 : 1.8
						}), tab.label]
					}, tab.to);
				})
			})
		]
	});
}
function Onboarding({ me }) {
	const qc = useQueryClient();
	const [mode, setMode] = (0, import_react.useState)("create");
	const [name, setName] = (0, import_react.useState)("ห้องงานของเรา");
	const [displayName, setDisplayName] = (0, import_react.useState)(me.name === "สมาชิก" ? "" : me.name);
	const [code, setCode] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: async () => {
			const trimmed = displayName.trim();
			if (trimmed && trimmed !== me.name) await renameMe({ data: { name: trimmed } });
			return createWorkspace({ data: { name: name.trim() || "ห้องงานของเรา" } });
		},
		onSuccess: async () => {
			toast.success("สร้างห้องแล้ว");
			await qc.invalidateQueries();
		},
		onError: (err) => toast.error(err.message)
	});
	const join = useMutation({
		mutationFn: async () => {
			const trimmed = displayName.trim();
			if (trimmed && trimmed !== me.name) await renameMe({ data: { name: trimmed } });
			return joinWorkspace({ data: { code } });
		},
		onSuccess: async () => {
			toast.success("เข้าห้องแล้ว");
			await qc.invalidateQueries();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-md flex-col justify-center px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineTohMark$1, { className: "size-11" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-line-dark",
					children: "ไลน์โต๊ะ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "ห้องงานสำหรับสองคน"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm text-muted",
				children: "ออกแบบมาให้คุย เก็บไฟล์ วาดบอร์ด และส่งรายงานเข้าไลน์ได้ทันที สำหรับเจ้านายที่ทำงานในไลน์อย่างเดียว"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "display-name",
					children: "ชื่อที่คู่หูและเจ้านายเห็น"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "display-name",
					className: "mt-1.5",
					value: displayName,
					onChange: (e) => setDisplayName(e.target.value),
					placeholder: "ชื่อเล่นในไลน์"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-page p-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMode("create"),
					className: `flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium ${mode === "create" ? "bg-surface text-ink shadow-lift" : "text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "สร้างห้อง"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMode("join"),
					className: `flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium ${mode === "join" ? "bg-surface text-ink shadow-lift" : "text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" }), "มีรหัสแล้ว"]
				})]
			}),
			mode === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "room-name",
					children: "ชื่อห้อง"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "room-name",
					className: "mt-1.5",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "ห้องงานของเรา"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					disabled: create.isPending,
					onClick: () => create.mutate(),
					children: create.isPending ? "กำลังสร้าง..." : "สร้างห้องแล้วชวนเพื่อนในไลน์"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "invite-code",
					children: "รหัส 6 ตัวจากเพื่อน"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "invite-code",
					className: "mt-1.5 text-center font-semibold tracking-[0.35em] uppercase",
					value: code,
					onChange: (e) => setCode(e.target.value.toUpperCase()),
					placeholder: "ABC123",
					maxLength: 8,
					autoCapitalize: "characters"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					disabled: join.isPending || code.trim().length < 4,
					onClick: () => join.mutate(),
					children: join.isPending ? "กำลังเข้าห้อง..." : "เข้าห้อง"
				})]
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const bootQ = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 bg-line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (bootQ.isError) {
		const message = bootQ.error instanceof Error ? bootQ.error.message : "โหลดไม่สำเร็จ";
		if (message === "Unauthorized") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
			workspace: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "โหลดห้องไม่สำเร็จ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 text-sm font-medium text-line-dark",
						onClick: () => void bootQ.refetch(),
						children: "ลองใหม่"
					})
				]
			})
		});
	}
	const bootstrap = bootQ.data;
	if (bootQ.isPending || !bootstrap) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		workspace: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })]
		})
	});
	if (!bootstrap.workspace) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		workspace: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, { me: bootstrap.me })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		workspace: bootstrap.workspace,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AppLayout as component };
