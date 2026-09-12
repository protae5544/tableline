import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as LineTohMark } from "./logo-MSOoJdnq.mjs";
import { t as Button } from "./button-BaQfuajX.mjs";
import { t as Input } from "./input-ZyaFPzYi.mjs";
import { t as Label } from "./label-pv-XhmAs.mjs";
import { t as GROK_PROVIDERS } from "./server-CQbTE_vl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DCKKF-EY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-line text-on-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 animate-pulse rounded-2xl bg-on-line/20" })
	});
	if (user) navigate({ to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "up") {
				const { error } = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: name.trim() || email.split("@")[0] || "สมาชิก"
				});
				if (error) throw new Error(error.message ?? "สมัครไม่สำเร็จ");
			} else {
				const { error } = await authClient.signIn.email({
					email: email.trim(),
					password
				});
				if (error) throw new Error(error.message ?? "เข้าสู่ระบบไม่สำเร็จ");
			}
			toast.success("เข้าสู่ระบบแล้ว");
			window.location.href = "/";
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-line text-on-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center px-6 pt-10 pb-8",
			style: { paddingTop: "max(2.5rem, env(safe-area-inset-top))" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineTohMark, {
					className: "size-16",
					inverse: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-3xl font-semibold tracking-tight",
					children: "ไลน์โต๊ะ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xs text-center text-sm text-on-line/85",
					children: "ห้องงานสำหรับสองคน ที่ส่งเข้าไลน์ได้ทันที สำหรับเจ้านายที่ไม่รับแอปอื่น"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-h-[55dvh] rounded-t-[28px] bg-surface px-5 py-6 text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "เข้าสู่ระบบ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "ใช้สิทธิ์ล็อกอินเพื่อเข้าห้องส่วนตัวของคุณกับเพื่อน"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
						children: ["เข้าด้วย ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						"หรือใช้อีเมล",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => void onEmail(e),
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "ชื่อ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							className: "mt-1.5",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "ชื่อในไลน์โต๊ะ"
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "อีเมล"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							className: "mt-1.5",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							autoComplete: "email"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							children: "รหัสผ่าน"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							className: "mt-1.5",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							minLength: 8,
							autoComplete: mode === "up" ? "new-password" : "current-password"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: busy || false,
							children: busy ? "กำลังเข้า..." : mode === "up" ? "สมัครแล้วเข้าห้อง" : "เข้าสู่ระบบด้วยอีเมล"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 w-full text-center text-sm text-line-dark",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "มีบัญชีแล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครด้วยอีเมล"
				})
			]
		})]
	});
}
//#endregion
export { Login as component };
