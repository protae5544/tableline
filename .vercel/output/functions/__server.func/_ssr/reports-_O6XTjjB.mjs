import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-CnGOKga6.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { t as Input } from "./input-ZyaFPzYi.mjs";
import { t as Label } from "./label-pv-XhmAs.mjs";
import { i as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as deleteReport, o as getBootstrap, p as listReports, s as getDashboard, v as saveReport, y as sendMessage } from "./api-D3940rIG.mjs";
import { t as Skeleton } from "./skeleton-V11c_Ooo.mjs";
import { i as formatThaiDate, o as reportToLineText, t as LineShareActions } from "./line-share-CnZ6P1pS.mjs";
import { n as todayISO } from "./format-B2aNvbEh.mjs";
import { t as Textarea } from "./textarea-Cok6x0nY.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-_O6XTjjB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-mint text-line-dark",
		muted: "bg-page text-muted",
		line: "bg-line text-on-line",
		warn: "bg-warn/15 text-warn",
		danger: "bg-danger/10 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var STATUS = [
	{
		id: "done",
		label: "เสร็จ"
	},
	{
		id: "doing",
		label: "ทำอยู่"
	},
	{
		id: "wait",
		label: "รอ"
	},
	{
		id: "blocked",
		label: "ติดปัญหา"
	}
];
function ReportStudio({ authorName }) {
	const qc = useQueryClient();
	const reportsQ = useQuery({
		queryKey: ["reports"],
		queryFn: () => listReports()
	});
	const dashQ = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const reports = reportsQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "รายงานและแดชบอร์ด"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "สร้างรายงานแล้วส่งเข้าไลน์เป็นข้อความที่เจ้านายอ่านได้ทันที"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setEditing({
						title: "รายงานประจำวัน",
						workDate: todayISO(),
						summary: "",
						nextPlan: "",
						hours: "",
						items: [{
							task: "",
							status: "doing",
							note: ""
						}]
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "สร้าง"]
				})]
			}),
			dashQ.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashCharts, { dash: dashQ.data }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mb-4 h-40 w-full" }),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportForm, {
				value: editing,
				authorName,
				onClose: () => setEditing(null),
				onSaved: async () => {
					setEditing(null);
					await qc.invalidateQueries({ queryKey: ["reports"] });
					await qc.invalidateQueries({ queryKey: ["dashboard"] });
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: reportsQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" }) : reports.length === 0 && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface px-5 py-10 text-center shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "ยังไม่มีรายงาน"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "สร้างรายงานแรก แล้วส่งเข้าไลน์ให้เจ้านาย"
					})]
				}) : reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
					report: r,
					authorName,
					onEdit: () => setEditing(r),
					onDeleted: async () => {
						await qc.invalidateQueries({ queryKey: ["reports"] });
						await qc.invalidateQueries({ queryKey: ["dashboard"] });
					}
				}, r.id))
			})
		]
	});
}
function DashCharts({ dash }) {
	const trend = dash.reportTrend.map((d) => ({
		...d,
		label: d.date.slice(5)
	}));
	const kinds = dash.fileKinds.map((k) => ({
		...k,
		name: {
			note: "โน้ต",
			web: "เว็บ",
			image: "รูป",
			file: "ไฟล์",
			board: "บอร์ด"
		}[k.kind] ?? k.kind
	}));
	const pieColors = [
		"#06C755",
		"#8BABD9",
		"#111111",
		"#D97706",
		"#E11D48"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					["ไฟล์ในลิ้นชัก", dash.files],
					["ข้อความในห้อง", dash.messages],
					["รายงานทั้งหมด", dash.reports],
					["งานเสร็จสัปดาห์นี้", dash.doneThisWeek]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-3 shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-semibold tabular-nums",
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted",
						children: label
					})]
				}, String(label)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-3 shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium",
						children: "จำนวนรายงานตามวัน"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-40",
						children: trend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "grid h-full place-items-center text-xs text-muted",
							children: "ยังไม่มีข้อมูลกราฟ"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "#E4E7EC",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: { fontSize: 11 },
										stroke: "#98A2B3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										width: 24,
										tick: { fontSize: 11 },
										stroke: "#98A2B3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "#06C755",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-3 shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium",
						children: "ชนิดไฟล์ในลิ้นชัก"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-40",
						children: kinds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "grid h-full place-items-center text-xs text-muted",
							children: "ยังไม่มีไฟล์"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: kinds,
								dataKey: "count",
								nameKey: "name",
								innerRadius: 32,
								outerRadius: 58,
								children: kinds.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: pieColors[i % pieColors.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
						})
					})]
				})]
			}),
			dash.recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-surface p-3 shadow-lift",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-medium",
					children: "กิจกรรมล่าสุด"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: dash.recent.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink",
								children: a.authorName
							}),
							" ",
							a.detail
						]
					}, a.id))
				})]
			}) : null
		]
	});
}
function ReportCard({ report, authorName, onEdit, onDeleted }) {
	const text = reportToLineText(report, report.authorName || authorName);
	const done = report.items.filter((i) => i.status === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-surface p-4 shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: report.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						formatThaiDate(report.workDate),
						" · ",
						report.authorName,
						" · ",
						done,
						"/",
						report.items.length,
						" เสร็จ"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: onEdit,
						children: "แก้"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": "ลบ",
						onClick: () => {
							if (!window.confirm("ลบรายงานนี้?")) return;
							deleteReport({ data: { id: report.id } }).then(onDeleted);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1",
				children: report.items.slice(0, 4).map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: item.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: item.task
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions, {
				text,
				compact: true,
				className: "mt-3"
			})
		]
	});
}
function StatusPill({ status }) {
	const s = {
		done: {
			label: "เสร็จ",
			variant: "default"
		},
		doing: {
			label: "ทำอยู่",
			variant: "line"
		},
		wait: {
			label: "รอ",
			variant: "muted"
		},
		blocked: {
			label: "ติดปัญหา",
			variant: "danger"
		}
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: s.variant,
		children: s.label
	});
}
function ReportForm({ value, authorName, onClose, onSaved }) {
	const [title, setTitle] = (0, import_react.useState)(value.title ?? "รายงานประจำวัน");
	const [workDate, setWorkDate] = (0, import_react.useState)(value.workDate ?? todayISO());
	const [summary, setSummary] = (0, import_react.useState)(value.summary ?? "");
	const [nextPlan, setNextPlan] = (0, import_react.useState)(value.nextPlan ?? "");
	const [hours, setHours] = (0, import_react.useState)(value.hours ?? "");
	const [items, setItems] = (0, import_react.useState)(value.items?.length ? value.items : [{
		task: "",
		status: "doing",
		note: ""
	}]);
	const preview = (0, import_react.useMemo)(() => {
		const fake = {
			id: value.id ?? 0,
			title,
			workDate,
			summary,
			nextPlan,
			hours: hours || null,
			items: items.filter((i) => i.task.trim()),
			createdBy: "",
			authorName,
			createdAt: "",
			updatedAt: ""
		};
		return reportToLineText(fake, authorName);
	}, [
		authorName,
		hours,
		items,
		nextPlan,
		summary,
		title,
		value.id,
		workDate
	]);
	const save = useMutation({
		mutationFn: () => saveReport({ data: {
			id: value.id,
			title: title.trim(),
			workDate,
			summary,
			nextPlan,
			hours: hours.trim() || null,
			items: items.filter((i) => i.task.trim())
		} }),
		onSuccess: async (res) => {
			toast.success("บันทึกรายงานแล้ว");
			await sendMessage({ data: {
				body: `ส่งรายงาน: ${title}`,
				kind: "report",
				refId: String(res.id)
			} }).catch(() => void 0);
			onSaved();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 space-y-3 rounded-2xl bg-surface p-4 shadow-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: value.id ? "แก้รายงาน" : "รายงานใหม่"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: onClose,
					children: "ปิด"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "r-title",
				children: "เรื่อง"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "r-title",
				className: "mt-1.5",
				value: title,
				onChange: (e) => setTitle(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "r-date",
					children: "วันที่"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "r-date",
					type: "date",
					className: "mt-1.5",
					value: workDate,
					onChange: (e) => setWorkDate(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "r-hours",
					children: "ชั่วโมง (ถ้ามี)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "r-hours",
					className: "mt-1.5",
					value: hours ?? "",
					onChange: (e) => setHours(e.target.value),
					inputMode: "decimal"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "รายการงาน" }),
					items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-page p-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.task,
							onChange: (e) => setItems((prev) => prev.map((it, idx) => idx === i ? {
								...it,
								task: e.target.value
							} : it)),
							placeholder: "ชื่องาน"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: [STATUS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setItems((prev) => prev.map((it, idx) => idx === i ? {
									...it,
									status: s.id
								} : it)),
								className: cn("h-8 rounded-full px-2.5 text-[11px] font-medium", item.status === s.id ? "bg-line text-on-line" : "bg-surface text-muted"),
								children: s.label
							}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto text-xs text-danger",
								onClick: () => setItems((prev) => prev.filter((_, idx) => idx !== i)),
								children: "ลบรายการ"
							})]
						})]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						size: "sm",
						onClick: () => setItems((prev) => [...prev, {
							task: "",
							status: "doing",
							note: ""
						}]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "เพิ่มรายการ"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "r-sum",
				children: "สรุปให้เจ้านาย"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "r-sum",
				className: "mt-1.5",
				value: summary,
				onChange: (e) => setSummary(e.target.value),
				placeholder: "วันนี้ทำอะไรไปบ้าง"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "r-next",
				children: "งานถัดไป"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "r-next",
				className: "mt-1.5",
				value: nextPlan,
				onChange: (e) => setNextPlan(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted",
				children: "ตัวอย่างข้อความที่จะเข้าไลน์"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-40 overflow-auto rounded-xl bg-page p-3 text-xs leading-relaxed whitespace-pre-wrap",
				children: preview
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShareActions, {
				text: preview,
				compact: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: save.isPending || !title.trim(),
				onClick: () => save.mutate(),
				children: save.isPending ? "กำลังบันทึก..." : "บันทึกรายงาน"
			})
		]
	});
}
function ReportsPage() {
	const bootQ = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	if (!bootQ.data?.me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportStudio, { authorName: bootQ.data.me.name });
}
//#endregion
export { ReportsPage as component };
