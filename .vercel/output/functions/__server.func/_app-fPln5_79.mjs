import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./_ssr/utils-CnGOKga6.mjs";
import { t as Button } from "./_ssr/button-BaQfuajX.mjs";
import { t as Input } from "./_ssr/input-ZyaFPzYi.mjs";
import { t as Label } from "./_ssr/label-pv-XhmAs.mjs";
import { o as Send } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { f as listMessages, h as renameMe, o as getBootstrap, s as getDashboard, y as sendMessage } from "./_ssr/api-D3940rIG.mjs";
import { t as Skeleton } from "./_ssr/skeleton-V11c_Ooo.mjs";
import { n as UserButton } from "./_ssr/gates-BXDb0caV.mjs";
import { a as inviteLineText, n as QUICK_PHRASES, r as dailyDigestLineText, t as LineShareActions$1 } from "./_ssr/line-share-CnZ6P1pS.mjs";
import { t as relativeThai } from "./_ssr/format-B2aNvbEh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-fPln5_79.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPanel({ bootstrap }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(bootstrap.me.name);
	const rename = useMutation({
		mutationFn: () => renameMe({ data: { name: name.trim() } }),
		onSuccess: async () => {
			toast.success("บันทึกชื่อแล้ว");
			await qc.invalidateQueries({ queryKey: ["bootstrap"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const ws = bootstrap.workspace;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 rounded-2xl bg-surface p-4 shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "บัญชี"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: bootstrap.me.email ?? "ล็อกอินแล้ว"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "me-name",
				children: "ชื่อในห้อง"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "me-name",
					value: name,
					onChange: (e) => setName(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: rename.isPending,
					onClick: () => rename.mutate(),
					children: "บันทึก"
				})]
			})] }),
			ws ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "รหัสเชิญ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xl tracking-[0.28em]",
					children: ws.inviteCode
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions$1, {
					className: "mt-3",
					compact: true,
					text: inviteLineText(ws.name, ws.inviteCode)
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl bg-page p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
			})
		]
	});
}
function ChatView({ bootstrap }) {
	const ws = bootstrap.workspace;
	const me = bootstrap.me;
	const qc = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)("");
	const scroller = (0, import_react.useRef)(null);
	const messagesQ = useQuery({
		queryKey: ["messages"],
		queryFn: () => listMessages(),
		refetchInterval: 2500
	});
	const dashQ = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard(),
		refetchInterval: 8e3
	});
	const send = useMutation({
		mutationFn: (body) => sendMessage({ data: {
			body,
			kind: "text"
		} }),
		onSuccess: async () => {
			setDraft("");
			await qc.invalidateQueries({ queryKey: ["messages"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const messages = messagesQ.data ?? [];
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages.length]);
	const digest = (0, import_react.useMemo)(() => {
		const dash = dashQ.data;
		return dailyDigestLineText({
			workspaceName: ws.name,
			authorName: me.name,
			files: dash?.files ?? 0,
			messages: dash?.messages ?? 0,
			reports: dash?.reports ?? 0,
			partnerName: ws.partner?.name ?? null
		});
	}, [
		dashQ.data,
		me.name,
		ws.name,
		ws.partner?.name
	]);
	function submit() {
		const body = draft.trim();
		if (!body) return;
		send.mutate(body);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-[calc(100dvh-7.5rem)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 bg-page px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteCard, {
						workspaceName: ws.name,
						code: ws.inviteCode,
						waiting: !ws.partner,
						partnerName: ws.partner?.name ?? null
					}),
					dashQ.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashStrip, { dash: dashQ.data }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions, {
						text: digest,
						compact: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-2xl bg-surface p-1 shadow-lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer list-none px-3 py-2.5 text-sm font-medium",
							children: "บัญชี รหัสเชิญ และออกจากระบบ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, { bootstrap })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "chat-wallpaper min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3",
				children: messagesQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "ml-auto h-12 w-1/2" })]
				}) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
					msg: m,
					mine: m.userId === me.id
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border bg-surface px-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 mb-2 flex gap-1.5 overflow-x-auto pb-1",
					children: QUICK_PHRASES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => send.mutate(p),
						className: "h-9 shrink-0 rounded-full bg-mint px-3 text-xs font-medium text-line-dark",
						children: p
					}, p))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex items-end gap-2 pb-3",
					onSubmit: (e) => {
						e.preventDefault();
						submit();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								submit();
							}
						},
						rows: 1,
						placeholder: "พิมพ์ข้อความ แล้วส่งเข้าไลน์ได้",
						className: "max-h-28 min-h-11 flex-1 resize-none rounded-[22px] border border-border bg-page px-4 py-2.5 text-base outline-none focus-visible:border-line"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						className: "rounded-full",
						disabled: send.isPending || !draft.trim(),
						"aria-label": "ส่ง",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})]
			})
		]
	});
}
function InviteCard({ workspaceName, code, waiting, partnerName }) {
	const text = inviteLineText(workspaceName, code);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface p-4 shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-line-dark",
				children: waiting ? "ชวนคู่หูเข้าห้องผ่านไลน์" : `ห้องนี้มี ${partnerName} แล้ว`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-2xl tracking-[0.28em]",
				children: code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "ห้องรับได้แค่ 2 คน ส่งรหัสนี้ในไลน์ให้เพื่อน"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions, {
				text,
				compact: true,
				className: "mt-3"
			})
		]
	});
}
function DashStrip({ dash }) {
	const cells = [
		{
			label: "ไฟล์",
			value: dash.files
		},
		{
			label: "ข้อความ",
			value: dash.messages
		},
		{
			label: "รายงาน",
			value: dash.reports
		},
		{
			label: "เสร็จสัปดาห์นี้",
			value: dash.doneThisWeek
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-4 gap-2",
		children: cells.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface px-2 py-2.5 text-center shadow-lift",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold tabular-nums text-ink",
				children: c.value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted",
				children: c.label
			})]
		}, c.label))
	});
}
function Bubble({ msg, mine }) {
	if (msg.kind === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-6 py-1 text-center text-[11px] text-ink/70",
		children: msg.body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex", mine ? "justify-end" : "justify-start"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("max-w-[80%] px-3 py-2 text-[15px] leading-snug shadow-sm", mine ? "bubble-me bg-line text-on-line" : "bubble-you bg-surface text-ink"),
			children: [
				!mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-0.5 text-[11px] font-medium text-line-dark",
					children: msg.authorName
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap",
					children: msg.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-1 text-[10px]", mine ? "text-on-line/75" : "text-subtle"),
					children: relativeThai(msg.createdAt)
				})
			]
		})
	});
}
function Home() {
	const bootQ = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	if (!bootQ.data?.workspace) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, { bootstrap: bootQ.data });
}
//#endregion
export { Home as component };
