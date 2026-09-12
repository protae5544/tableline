import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as shortId, i as parseJson, n as inviteCode, r as iso } from "./utils-CnGOKga6.mjs";
import { t as authMiddleware } from "./middleware-BXSyzxH0.mjs";
import { D as _enum, F as object, O as any, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-B0cdCtvR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CQQeUk9J.js
async function ensureProfile(sql, userId, fallbackName) {
	await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${fallbackName})
    on conflict (user_id) do nothing
  `;
}
async function loadProfile(sql, userId, fallback) {
	return {
		id: userId,
		name: (await sql`
    select user_id, display_name from profiles where user_id = ${userId}
  `)[0]?.display_name || fallback.name,
		email: fallback.email,
		image: fallback.image
	};
}
async function memberOf(sql, userId) {
	return (await sql`
    select workspace_id, role from workspace_members where user_id = ${userId} limit 1
  `)[0] ?? null;
}
async function requireWorkspace(sql, userId) {
	const row = await memberOf(sql, userId);
	if (!row) throw new Error("ยังไม่มีห้องงาน");
	return row;
}
async function namesById(sql, ids) {
	const unique = [...new Set(ids.filter(Boolean))];
	const map = /* @__PURE__ */ new Map();
	if (unique.length === 0) return map;
	const rows = await sql`
    select user_id, display_name from profiles
  `;
	const wanted = new Set(unique);
	for (const r of rows) if (wanted.has(r.user_id)) map.set(r.user_id, r.display_name);
	return map;
}
async function logActivity(sql, workspaceId, userId, action, detail) {
	await sql`
    insert into activities (workspace_id, user_id, action, detail)
    values (${workspaceId}, ${userId}, ${action}, ${detail})
  `;
}
async function sessionIdentity(userId) {
	try {
		const { getSessionUser } = await import("./verify.server-B3vJMBr-.mjs");
		const u = await getSessionUser();
		if (u && u.id === userId) {
			const email = u.email ?? null;
			return {
				name: email?.split("@")[0] || "สมาชิก",
				email,
				image: null
			};
		}
	} catch {}
	return {
		name: "สมาชิก",
		email: null,
		image: null
	};
}
async function buildWorkspace(sql, userId, membership) {
	const ws = (await sql`
    select id, name, invite_code, owner_id from workspaces where id = ${membership.workspace_id}
  `)[0];
	if (!ws) throw new Error("ไม่พบห้องงาน");
	const members = await sql`
    select user_id from workspace_members where workspace_id = ${ws.id}
  `;
	const partnerId = members.map((m) => m.user_id).find((id) => id !== userId);
	let partner = null;
	if (partnerId) partner = {
		id: partnerId,
		name: (await namesById(sql, [partnerId])).get(partnerId) || "คู่หู"
	};
	return {
		id: ws.id,
		name: ws.name,
		inviteCode: ws.invite_code,
		role: membership.role === "owner" ? "owner" : "member",
		partner,
		memberCount: members.length
	};
}
var DEFAULT_FOLDERS = [
	"เอกสารงาน",
	"ลิงก์เว็บ",
	"รายงานส่งเจ้านาย",
	"ภาพและไฟล์"
];
var WELCOME_NOTE = `วิธีใช้ไลน์โต๊ะกับเจ้านายที่ทำงานในไลน์อย่างเดียว

1. ชวนคู่หูด้วยรหัสห้อง — กดส่งเข้าไลน์ได้เลย
2. พิมพ์คุยในแท็บแชท แล้วใช้ปุ่มส่งเข้าไลน์เมื่อต้องรายงานหัวหน้า
3. เปิดบอร์ดวาดแผน บนแท็บเล็ตใช้นิ้วได้
4. ลิ้นชักเก็บโน้ต ลิงก์เว็บ รูป และไฟล์
5. สร้างรายงานแล้วกดคัดลอก / ส่งเข้าไลน์เป็นข้อความที่อ่านง่าย

ทุกอย่างออกแบบมาให้วางในแชทไลน์ได้ทันที โดยไม่ต้องสอนเจ้านายใช้แอปใหม่`;
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "1d6bb4f0e270a32a5bf9e3bb6caa9c0ee9a8ec0309c035580a78d8c74458f71c",
	name: "getBootstrap",
	filename: "src/lib/server/api.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBootstrap_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const ident = await sessionIdentity(context.userId);
	await ensureProfile(sql, context.userId, ident.name);
	const me = await loadProfile(sql, context.userId, ident);
	const membership = await memberOf(sql, context.userId);
	if (!membership) return {
		me,
		workspace: null
	};
	return {
		me,
		workspace: await buildWorkspace(sql, context.userId, membership)
	};
});
var renameMe_createServerFn_handler = createServerRpc({
	id: "8e972f5f77b98a4e58b67076964735f99b75f8e27f1be5080e08e041d2d4fbfb",
	name: "renameMe",
	filename: "src/lib/server/api.ts"
}, (opts) => renameMe.__executeServer(opts));
var renameMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(renameMe_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into profiles (user_id, display_name)
      values (${context.userId}, ${data.name})
      on conflict (user_id) do update set display_name = excluded.display_name
    `;
	return { ok: true };
});
var createWorkspace_createServerFn_handler = createServerRpc({
	id: "0a2c59ead85978d1e62875a7161de68a22e678853f79ce62a4ac6bfd0f258099",
	name: "createWorkspace",
	filename: "src/lib/server/api.ts"
}, (opts) => createWorkspace.__executeServer(opts));
var createWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(createWorkspace_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const ident = await sessionIdentity(context.userId);
	await ensureProfile(sql, context.userId, ident.name);
	if (await memberOf(sql, context.userId)) throw new Error("คุณอยู่ในห้องอยู่แล้ว");
	const id = shortId("ws");
	const code = inviteCode();
	await sql`
      insert into workspaces (id, name, invite_code, owner_id)
      values (${id}, ${data.name}, ${code}, ${context.userId})
    `;
	await sql`
      insert into workspace_members (workspace_id, user_id, role)
      values (${id}, ${context.userId}, ${"owner"})
    `;
	await sql`
      insert into boards (workspace_id, strokes, notes, updated_by)
      values (${id}, ${"[]"}, ${"[]"}, ${context.userId})
    `;
	for (const folderName of DEFAULT_FOLDERS) await sql`
        insert into folders (workspace_id, name, created_by)
        values (${id}, ${folderName}, ${context.userId})
      `;
	await sql`
      insert into documents (workspace_id, folder_id, title, kind, content, created_by)
      values (${id}, ${(await sql`
      select id from folders where workspace_id = ${id} order by id asc limit 1
    `)[0]?.id ?? null}, ${"วิธีใช้ไลน์โต๊ะ"}, ${"note"}, ${WELCOME_NOTE}, ${context.userId})
    `;
	await sql`
      insert into messages (workspace_id, user_id, body, kind)
      values (
        ${id},
        ${context.userId},
        ${"ห้องนี้พร้อมแล้ว ส่งรหัสให้เพื่อนในไลน์ แล้วเริ่มเก็บงานได้เลย"},
        ${"system"}
      )
    `;
	await logActivity(sql, id, context.userId, "create_room", `สร้างห้อง ${data.name}`);
	const membership = await requireWorkspace(sql, context.userId);
	return buildWorkspace(sql, context.userId, membership);
});
var joinWorkspace_createServerFn_handler = createServerRpc({
	id: "37bc124b1f1af306161a9824ac9261c29ad44688018410e7bf18f859b88fa0dd",
	name: "joinWorkspace",
	filename: "src/lib/server/api.ts"
}, (opts) => joinWorkspace.__executeServer(opts));
var joinWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().trim().min(4).max(12) })).handler(joinWorkspace_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const ident = await sessionIdentity(context.userId);
	await ensureProfile(sql, context.userId, ident.name);
	if (await memberOf(sql, context.userId)) throw new Error("คุณอยู่ในห้องอยู่แล้ว");
	const room = (await sql`
      select id, name from workspaces where invite_code = ${data.code.trim().toUpperCase()}
    `)[0];
	if (!room) throw new Error("รหัสไม่ถูกต้อง");
	if (((await sql`
      select count(*)::int as n from workspace_members where workspace_id = ${room.id}
    `)[0]?.n ?? 0) >= 2) throw new Error("ห้องนี้มีครบ 2 คนแล้ว");
	await sql`
      insert into workspace_members (workspace_id, user_id, role)
      values (${room.id}, ${context.userId}, ${"member"})
    `;
	await sql`
      insert into messages (workspace_id, user_id, body, kind)
      values (${room.id}, ${context.userId}, ${"เข้าห้องแล้ว พร้อมทำงานด้วยกัน"}, ${"system"})
    `;
	await logActivity(sql, room.id, context.userId, "join", "เข้าห้องด้วยรหัสเชิญ");
	const membership = await requireWorkspace(sql, context.userId);
	return buildWorkspace(sql, context.userId, membership);
});
var listMessages_createServerFn_handler = createServerRpc({
	id: "670b0c0555328227b81b46a193cd5f45d1fbeb41f1e5ced45e95db7fb2476dfa",
	name: "listMessages",
	filename: "src/lib/server/api.ts"
}, (opts) => listMessages.__executeServer(opts));
var listMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMessages_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, user_id, body, kind, ref_id, created_at
      from messages
      where workspace_id = ${(await requireWorkspace(sql, context.userId)).workspace_id}
      order by id asc
      limit 400
    `;
	const nameMap = await namesById(sql, rows.map((r) => r.user_id));
	return rows.map((r) => ({
		id: r.id,
		userId: r.user_id,
		body: r.body,
		kind: [
			"text",
			"file",
			"report",
			"system"
		].includes(r.kind) ? r.kind : "text",
		refId: r.ref_id,
		createdAt: iso(r.created_at),
		authorName: nameMap.get(r.user_id) || "สมาชิก"
	}));
});
var sendMessage_createServerFn_handler = createServerRpc({
	id: "053954e82c986ac7796898193f9c2c1fa3068615c49fc19b9bc58d6a6419f3d2",
	name: "sendMessage",
	filename: "src/lib/server/api.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	body: string().trim().min(1).max(4e3),
	kind: _enum([
		"text",
		"file",
		"report"
	]).default("text"),
	refId: string().nullable().optional()
})).handler(sendMessage_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`
      insert into messages (workspace_id, user_id, body, kind, ref_id)
      values (
        ${(await requireWorkspace(sql, context.userId)).workspace_id},
        ${context.userId},
        ${data.body},
        ${data.kind},
        ${data.refId ?? null}
      )
    `;
	return { ok: true };
});
var listFolders_createServerFn_handler = createServerRpc({
	id: "cb3c05c6c573fcd9a8ed820195d75e4e5cf974996f87c27c0b362c69785ee7c8",
	name: "listFolders",
	filename: "src/lib/server/api.ts"
}, (opts) => listFolders.__executeServer(opts));
var listFolders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFolders_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return (await sql`
      select f.id, f.name, f.created_by, f.created_at,
        (select count(*)::int from documents d where d.folder_id = f.id) as doc_count
      from folders f
      where f.workspace_id = ${(await requireWorkspace(sql, context.userId)).workspace_id}
      order by f.id asc
    `).map((r) => ({
		id: r.id,
		name: r.name,
		createdBy: r.created_by,
		createdAt: iso(r.created_at),
		docCount: r.doc_count
	}));
});
var createFolder_createServerFn_handler = createServerRpc({
	id: "b036eb017c7663e07780ea9f8cec1da2d74e0eb63a417e76df736196e2e2b4c4",
	name: "createFolder",
	filename: "src/lib/server/api.ts"
}, (opts) => createFolder.__executeServer(opts));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().trim().min(1).max(40) })).handler(createFolder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	await sql`
      insert into folders (workspace_id, name, created_by)
      values (${membership.workspace_id}, ${data.name}, ${context.userId})
    `;
	await logActivity(sql, membership.workspace_id, context.userId, "folder", `สร้างลิ้นชัก ${data.name}`);
	return { ok: true };
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "13ce1eb0a32ad8e6af010d846fb36e91528e9abf5e36fb9c985ac6c89bac9a71",
	name: "listDocuments",
	filename: "src/lib/server/api.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ folderId: number().nullable().optional() }).optional()).handler(listDocuments_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	const folderId = data?.folderId ?? null;
	const rows = folderId ? await sql`
          select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
          from documents
          where workspace_id = ${membership.workspace_id} and folder_id = ${folderId}
          order by updated_at desc
        ` : await sql`
          select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
          from documents
          where workspace_id = ${membership.workspace_id}
          order by updated_at desc
        `;
	const nameMap = await namesById(sql, rows.map((r) => r.created_by));
	return rows.map((r) => ({
		id: r.id,
		folderId: r.folder_id,
		title: r.title,
		kind: [
			"note",
			"web",
			"image",
			"file",
			"board"
		].includes(r.kind) ? r.kind : "note",
		content: r.content,
		mime: r.mime,
		createdBy: r.created_by,
		authorName: nameMap.get(r.created_by) || "สมาชิก",
		updatedAt: iso(r.updated_at),
		createdAt: iso(r.created_at)
	}));
});
var getDocument_createServerFn_handler = createServerRpc({
	id: "967e453e8e7f9b3e5f860f6232edcffda144941897e4d0c69234a51749970cf7",
	name: "getDocument",
	filename: "src/lib/server/api.ts"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(getDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	const r = (await sql`
      select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
      from documents
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `)[0];
	if (!r) throw new Error("ไม่พบเอกสาร");
	const nameMap = await namesById(sql, [r.created_by]);
	return {
		id: r.id,
		folderId: r.folder_id,
		title: r.title,
		kind: [
			"note",
			"web",
			"image",
			"file",
			"board"
		].includes(r.kind) ? r.kind : "note",
		content: r.content,
		mime: r.mime,
		createdBy: r.created_by,
		authorName: nameMap.get(r.created_by) || "สมาชิก",
		updatedAt: iso(r.updated_at),
		createdAt: iso(r.created_at)
	};
});
var saveDocument_createServerFn_handler = createServerRpc({
	id: "5c4b55f6d1bdff08f970b09f8ac13df77e16d8953d45728384ec031acccf9fe4",
	name: "saveDocument",
	filename: "src/lib/server/api.ts"
}, (opts) => saveDocument.__executeServer(opts));
var saveDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	folderId: number().nullable().optional(),
	title: string().trim().min(1).max(120),
	kind: _enum([
		"note",
		"web",
		"image",
		"file",
		"board"
	]),
	content: string().max(9e5),
	mime: string().max(120).nullable().optional()
})).handler(saveDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	if (data.id) {
		const updated = await sql`
        update documents
        set title = ${data.title},
            content = ${data.content},
            mime = ${data.mime ?? null},
            updated_at = now()
        where id = ${data.id} and workspace_id = ${membership.workspace_id}
        returning id
      `;
		if (!updated[0]) throw new Error("ไม่พบเอกสาร");
		await logActivity(sql, membership.workspace_id, context.userId, "edit_doc", `แก้ ${data.title}`);
		return { id: updated[0].id };
	}
	const id = (await sql`
      insert into documents (workspace_id, folder_id, title, kind, content, mime, created_by)
      values (
        ${membership.workspace_id},
        ${data.folderId ?? null},
        ${data.title},
        ${data.kind},
        ${data.content},
        ${data.mime ?? null},
        ${context.userId}
      )
      returning id
    `)[0]?.id;
	if (!id) throw new Error("บันทึกไม่สำเร็จ");
	await logActivity(sql, membership.workspace_id, context.userId, "add_doc", `เพิ่ม ${data.title}`);
	return { id };
});
var deleteDocument_createServerFn_handler = createServerRpc({
	id: "b157876d9a6ef48ea2d7c9686b4745a5f01d9b8d2613e8dfcf32048fd6ef0e3b",
	name: "deleteDocument",
	filename: "src/lib/server/api.ts"
}, (opts) => deleteDocument.__executeServer(opts));
var deleteDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	await sql`
      delete from documents
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `;
	return { ok: true };
});
function mapReport(row) {
	return {
		id: row.id,
		title: row.title,
		workDate: iso(row.work_date).slice(0, 10),
		summary: row.summary,
		nextPlan: row.next_plan,
		hours: row.hours,
		items: parseJson(row.items, []),
		createdBy: row.created_by,
		authorName: row.authorName,
		createdAt: iso(row.created_at),
		updatedAt: iso(row.updated_at)
	};
}
var listReports_createServerFn_handler = createServerRpc({
	id: "7a270e08e1388422957b0cd9cc31f864a4993fd9526c0d9d42acd57bfad3ac22",
	name: "listReports",
	filename: "src/lib/server/api.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReports_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, title, work_date, summary, next_plan, hours, items, created_by, created_at, updated_at
      from reports
      where workspace_id = ${(await requireWorkspace(sql, context.userId)).workspace_id}
      order by work_date desc, id desc
    `;
	const nameMap = await namesById(sql, rows.map((r) => r.created_by));
	return rows.map((r) => mapReport({
		...r,
		authorName: nameMap.get(r.created_by) || "สมาชิก"
	}));
});
var saveReport_createServerFn_handler = createServerRpc({
	id: "e8bff06d452226181a4a6ec65d648ae7bb8e7dc83b0bf843daa24a1553b22335",
	name: "saveReport",
	filename: "src/lib/server/api.ts"
}, (opts) => saveReport.__executeServer(opts));
var saveReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	title: string().trim().min(1).max(120),
	workDate: string().min(8).max(10),
	summary: string().max(4e3),
	nextPlan: string().max(2e3),
	hours: string().max(12).nullable().optional(),
	items: array(object({
		task: string().trim().min(1).max(200),
		status: _enum([
			"done",
			"doing",
			"blocked",
			"wait"
		]),
		note: string().max(400)
	})).max(40)
})).handler(saveReport_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	const itemsJson = JSON.stringify(data.items);
	if (data.id) {
		const updated = await sql`
        update reports
        set title = ${data.title},
            work_date = ${data.workDate},
            summary = ${data.summary},
            next_plan = ${data.nextPlan},
            hours = ${data.hours ?? null},
            items = ${itemsJson},
            updated_at = now()
        where id = ${data.id} and workspace_id = ${membership.workspace_id}
        returning id
      `;
		if (!updated[0]) throw new Error("ไม่พบรายงาน");
		await logActivity(sql, membership.workspace_id, context.userId, "edit_report", `แก้รายงาน ${data.title}`);
		return { id: updated[0].id };
	}
	const id = (await sql`
      insert into reports (workspace_id, title, work_date, summary, next_plan, hours, items, created_by)
      values (
        ${membership.workspace_id},
        ${data.title},
        ${data.workDate},
        ${data.summary},
        ${data.nextPlan},
        ${data.hours ?? null},
        ${itemsJson},
        ${context.userId}
      )
      returning id
    `)[0]?.id;
	if (!id) throw new Error("บันทึกไม่สำเร็จ");
	await logActivity(sql, membership.workspace_id, context.userId, "add_report", `สร้างรายงาน ${data.title}`);
	return { id };
});
var deleteReport_createServerFn_handler = createServerRpc({
	id: "57d08d45500fe1e97743c11cc4a763ec7ac7de4b570c69b6cc1afaf5b21ce5b0",
	name: "deleteReport",
	filename: "src/lib/server/api.ts"
}, (opts) => deleteReport.__executeServer(opts));
var deleteReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteReport_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	await sql`
      delete from reports
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `;
	return { ok: true };
});
var getBoard_createServerFn_handler = createServerRpc({
	id: "f36fa7c781c0d7d9d28ffe3f9803c5ccaad2a494cd851f9fb74dcaa99c1a6996",
	name: "getBoard",
	filename: "src/lib/server/api.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBoard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const row = (await sql`
      select strokes, notes, updated_at, updated_by from boards where workspace_id = ${(await requireWorkspace(sql, context.userId)).workspace_id}
    `)[0];
	if (!row) return {
		strokes: [],
		notes: [],
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		updatedBy: null
	};
	return {
		strokes: parseJson(row.strokes, []),
		notes: parseJson(row.notes, []),
		updatedAt: iso(row.updated_at),
		updatedBy: row.updated_by
	};
});
var saveBoard_createServerFn_handler = createServerRpc({
	id: "9f44c0bd4cfee7fb86eefbe628c4d49599857052140187d274100515c20cddfb",
	name: "saveBoard",
	filename: "src/lib/server/api.ts"
}, (opts) => saveBoard.__executeServer(opts));
var saveBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	strokes: array(any()).max(800),
	notes: array(any()).max(80)
})).handler(saveBoard_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const membership = await requireWorkspace(sql, context.userId);
	const strokes = JSON.stringify(data.strokes);
	const notes = JSON.stringify(data.notes);
	await sql`
      insert into boards (workspace_id, strokes, notes, updated_by, updated_at)
      values (${membership.workspace_id}, ${strokes}, ${notes}, ${context.userId}, now())
      on conflict (workspace_id) do update
        set strokes = excluded.strokes,
            notes = excluded.notes,
            updated_by = excluded.updated_by,
            updated_at = now()
    `;
	return {
		ok: true,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "4303ff2527037c84f7e30b270e3f6e8a6118e8bf6a13e0e3f4d48144dd33a3ab",
	name: "getDashboard",
	filename: "src/lib/server/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const ws = (await requireWorkspace(sql, context.userId)).workspace_id;
	const [files, messages, reports, board, recent] = await Promise.all([
		sql`select count(*)::int as n from documents where workspace_id = ${ws}`,
		sql`select count(*)::int as n from messages where workspace_id = ${ws}`,
		sql`select count(*)::int as n from reports where workspace_id = ${ws}`,
		sql`
        select count(*)::int as n from activities
        where workspace_id = ${ws} and action in ('board', 'board_snap')
      `,
		sql`
        select id, user_id, action, detail, created_at
        from activities
        where workspace_id = ${ws}
        order by id desc
        limit 8
      `
	]);
	const reportRows = await sql`
      select items, work_date from reports where workspace_id = ${ws}
    `;
	let doneThisWeek = 0;
	let doingThisWeek = 0;
	const weekAgo = Date.now() - 6048e5;
	const trendMap = /* @__PURE__ */ new Map();
	for (const r of reportRows) {
		const items = parseJson(r.items, []);
		const d = iso(r.work_date).slice(0, 10);
		trendMap.set(d, (trendMap.get(d) ?? 0) + 1);
		if ((/* @__PURE__ */ new Date(d + "T00:00:00")).getTime() >= weekAgo) for (const it of items) {
			if (it.status === "done") doneThisWeek += 1;
			if (it.status === "doing") doingThisWeek += 1;
		}
	}
	const kinds = await sql`
      select kind, count(*)::int as count from documents
      where workspace_id = ${ws}
      group by kind
    `;
	const nameMap = await namesById(sql, recent.map((r) => r.user_id));
	const recentMapped = recent.map((r) => ({
		id: r.id,
		userId: r.user_id,
		authorName: nameMap.get(r.user_id) || "สมาชิก",
		action: r.action,
		detail: r.detail,
		createdAt: iso(r.created_at)
	}));
	const reportTrend = [...trendMap.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-10).map(([date, count]) => ({
		date,
		count
	}));
	return {
		files: files[0]?.n ?? 0,
		messages: messages[0]?.n ?? 0,
		reports: reports[0]?.n ?? 0,
		boardUpdates: board[0]?.n ?? 0,
		doneThisWeek,
		doingThisWeek,
		recent: recentMapped,
		reportTrend,
		fileKinds: kinds
	};
});
var logBoardActivity_createServerFn_handler = createServerRpc({
	id: "04dd56879c6716215c5a4dab7c0297d74c44748c663f615e9b61f5a5d4b830ba",
	name: "logBoardActivity",
	filename: "src/lib/server/api.ts"
}, (opts) => logBoardActivity.__executeServer(opts));
var logBoardActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ detail: string().max(120) })).handler(logBoardActivity_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await logActivity(sql, (await requireWorkspace(sql, context.userId)).workspace_id, context.userId, "board", data.detail);
	return { ok: true };
});
//#endregion
export { createFolder_createServerFn_handler, createWorkspace_createServerFn_handler, deleteDocument_createServerFn_handler, deleteReport_createServerFn_handler, getBoard_createServerFn_handler, getBootstrap_createServerFn_handler, getDashboard_createServerFn_handler, getDocument_createServerFn_handler, joinWorkspace_createServerFn_handler, listDocuments_createServerFn_handler, listFolders_createServerFn_handler, listMessages_createServerFn_handler, listReports_createServerFn_handler, logBoardActivity_createServerFn_handler, renameMe_createServerFn_handler, saveBoard_createServerFn_handler, saveDocument_createServerFn_handler, saveReport_createServerFn_handler, sendMessage_createServerFn_handler };
