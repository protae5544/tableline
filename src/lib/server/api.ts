import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { inviteCode, iso, parseJson, shortId } from "@/lib/utils";
import type {
  Activity,
  BoardState,
  Bootstrap,
  ChatMessage,
  Dashboard,
  DocumentItem,
  Folder,
  Profile,
  Report,
  ReportItem,
  StickyNote,
  Stroke,
  Workspace,
} from "@/lib/types";

type MemberRow = { workspace_id: string; role: string };

async function ensureProfile(
  sql: Sql,
  userId: string,
  fallbackName: string,
): Promise<void> {
  await sql`
    insert into profiles (user_id, display_name)
    values (${userId}, ${fallbackName})
    on conflict (user_id) do nothing
  `;
}

async function loadProfile(
  sql: Sql,
  userId: string,
  fallback: { name: string; email: string | null; image: string | null },
): Promise<Profile> {
  const rows = await sql<{ user_id: string; display_name: string }>`
    select user_id, display_name from profiles where user_id = ${userId}
  `;
  return {
    id: userId,
    name: rows[0]?.display_name || fallback.name,
    email: fallback.email,
    image: fallback.image,
  };
}

async function memberOf(sql: Sql, userId: string): Promise<MemberRow | null> {
  const rows = await sql<MemberRow>`
    select workspace_id, role from workspace_members where user_id = ${userId} limit 1
  `;
  return rows[0] ?? null;
}

async function requireWorkspace(sql: Sql, userId: string): Promise<MemberRow> {
  const row = await memberOf(sql, userId);
  if (!row) throw new Error("ยังไม่มีห้องงาน");
  return row;
}

async function namesById(
  sql: Sql,
  ids: string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, string>();
  if (unique.length === 0) return map;
  const rows = await sql<{ user_id: string; display_name: string }>`
    select user_id, display_name from profiles
  `;
  const wanted = new Set(unique);
  for (const r of rows) {
    if (wanted.has(r.user_id)) map.set(r.user_id, r.display_name);
  }
  return map;
}

async function logActivity(
  sql: Sql,
  workspaceId: string,
  userId: string,
  action: string,
  detail: string,
): Promise<void> {
  await sql`
    insert into activities (workspace_id, user_id, action, detail)
    values (${workspaceId}, ${userId}, ${action}, ${detail})
  `;
}

async function sessionIdentity(userId: string): Promise<{
  name: string;
  email: string | null;
  image: string | null;
}> {
  try {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const u = await getSessionUser();
    if (u && u.id === userId) {
      const email = u.email ?? null;
      return {
        name: email?.split("@")[0] || "สมาชิก",
        email,
        image: null,
      };
    }
  } catch {
    /* preview bearer path may not have a cookie session */
  }
  return { name: "สมาชิก", email: null, image: null };
}

async function buildWorkspace(
  sql: Sql,
  userId: string,
  membership: MemberRow,
): Promise<Workspace> {
  const wsRows = await sql<{
    id: string;
    name: string;
    invite_code: string;
    owner_id: string;
  }>`
    select id, name, invite_code, owner_id from workspaces where id = ${membership.workspace_id}
  `;
  const ws = wsRows[0];
  if (!ws) throw new Error("ไม่พบห้องงาน");
  const members = await sql<{ user_id: string }>`
    select user_id from workspace_members where workspace_id = ${ws.id}
  `;
  const partnerId = members.map((m) => m.user_id).find((id) => id !== userId);
  let partner: Workspace["partner"] = null;
  if (partnerId) {
    const nameMap = await namesById(sql, [partnerId]);
    partner = { id: partnerId, name: nameMap.get(partnerId) || "คู่หู" };
  }
  return {
    id: ws.id,
    name: ws.name,
    inviteCode: ws.invite_code,
    role: membership.role === "owner" ? "owner" : "member",
    partner,
    memberCount: members.length,
  };
}

const DEFAULT_FOLDERS = [
  "เอกสารงาน",
  "ลิงก์เว็บ",
  "รายงานส่งเจ้านาย",
  "ภาพและไฟล์",
] as const;

const WELCOME_NOTE = `วิธีใช้ไลน์โต๊ะกับเจ้านายที่ทำงานในไลน์อย่างเดียว

1. ชวนคู่หูด้วยรหัสห้อง — กดส่งเข้าไลน์ได้เลย
2. พิมพ์คุยในแท็บแชท แล้วใช้ปุ่มส่งเข้าไลน์เมื่อต้องรายงานหัวหน้า
3. เปิดบอร์ดวาดแผน บนแท็บเล็ตใช้นิ้วได้
4. ลิ้นชักเก็บโน้ต ลิงก์เว็บ รูป และไฟล์
5. สร้างรายงานแล้วกดคัดลอก / ส่งเข้าไลน์เป็นข้อความที่อ่านง่าย

ทุกอย่างออกแบบมาให้วางในแชทไลน์ได้ทันที โดยไม่ต้องสอนเจ้านายใช้แอปใหม่`;

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Bootstrap> => {
    const sql = await getSql();
    const ident = await sessionIdentity(context.userId);
    await ensureProfile(sql, context.userId, ident.name);
    const me = await loadProfile(sql, context.userId, ident);
    const membership = await memberOf(sql, context.userId);
    if (!membership) return { me, workspace: null };
    return { me, workspace: await buildWorkspace(sql, context.userId, membership) };
  });

export const renameMe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1).max(40) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, display_name)
      values (${context.userId}, ${data.name})
      on conflict (user_id) do update set display_name = excluded.display_name
    `;
    return { ok: true as const };
  });

export const createWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1).max(40) }))
  .handler(async ({ context, data }): Promise<Workspace> => {
    const sql = await getSql();
    const ident = await sessionIdentity(context.userId);
    await ensureProfile(sql, context.userId, ident.name);
    const existing = await memberOf(sql, context.userId);
    if (existing) throw new Error("คุณอยู่ในห้องอยู่แล้ว");
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
    for (const folderName of DEFAULT_FOLDERS) {
      await sql`
        insert into folders (workspace_id, name, created_by)
        values (${id}, ${folderName}, ${context.userId})
      `;
    }
    const folderRows = await sql<{ id: number }>`
      select id from folders where workspace_id = ${id} order by id asc limit 1
    `;
    const folderId = folderRows[0]?.id ?? null;
    await sql`
      insert into documents (workspace_id, folder_id, title, kind, content, created_by)
      values (${id}, ${folderId}, ${"วิธีใช้ไลน์โต๊ะ"}, ${"note"}, ${WELCOME_NOTE}, ${context.userId})
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

export const joinWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ code: z.string().trim().min(4).max(12) }))
  .handler(async ({ context, data }): Promise<Workspace> => {
    const sql = await getSql();
    const ident = await sessionIdentity(context.userId);
    await ensureProfile(sql, context.userId, ident.name);
    const existing = await memberOf(sql, context.userId);
    if (existing) throw new Error("คุณอยู่ในห้องอยู่แล้ว");
    const code = data.code.trim().toUpperCase();
    const rooms = await sql<{ id: string; name: string }>`
      select id, name from workspaces where invite_code = ${code}
    `;
    const room = rooms[0];
    if (!room) throw new Error("รหัสไม่ถูกต้อง");
    const countRows = await sql<{ n: number }>`
      select count(*)::int as n from workspace_members where workspace_id = ${room.id}
    `;
    if ((countRows[0]?.n ?? 0) >= 2) throw new Error("ห้องนี้มีครบ 2 คนแล้ว");
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

export const listMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ChatMessage[]> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const rows = await sql<{
      id: number;
      user_id: string;
      body: string;
      kind: string;
      ref_id: string | null;
      created_at: unknown;
    }>`
      select id, user_id, body, kind, ref_id, created_at
      from messages
      where workspace_id = ${membership.workspace_id}
      order by id asc
      limit 400
    `;
    const nameMap = await namesById(
      sql,
      rows.map((r) => r.user_id),
    );
    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      body: r.body,
      kind: (["text", "file", "report", "system"].includes(r.kind)
        ? r.kind
        : "text") as ChatMessage["kind"],
      refId: r.ref_id,
      createdAt: iso(r.created_at),
      authorName: nameMap.get(r.user_id) || "สมาชิก",
    }));
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      body: z.string().trim().min(1).max(4000),
      kind: z.enum(["text", "file", "report"]).default("text"),
      refId: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    await sql`
      insert into messages (workspace_id, user_id, body, kind, ref_id)
      values (
        ${membership.workspace_id},
        ${context.userId},
        ${data.body},
        ${data.kind},
        ${data.refId ?? null}
      )
    `;
    return { ok: true as const };
  });

export const listFolders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Folder[]> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const rows = await sql<{
      id: number;
      name: string;
      created_by: string;
      created_at: unknown;
      doc_count: number;
    }>`
      select f.id, f.name, f.created_by, f.created_at,
        (select count(*)::int from documents d where d.folder_id = f.id) as doc_count
      from folders f
      where f.workspace_id = ${membership.workspace_id}
      order by f.id asc
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      createdBy: r.created_by,
      createdAt: iso(r.created_at),
      docCount: r.doc_count,
    }));
  });

export const createFolder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(1).max(40) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    await sql`
      insert into folders (workspace_id, name, created_by)
      values (${membership.workspace_id}, ${data.name}, ${context.userId})
    `;
    await logActivity(
      sql,
      membership.workspace_id,
      context.userId,
      "folder",
      `สร้างลิ้นชัก ${data.name}`,
    );
    return { ok: true as const };
  });

export const listDocuments = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ folderId: z.number().nullable().optional() }).optional())
  .handler(async ({ context, data }): Promise<DocumentItem[]> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const folderId = data?.folderId ?? null;
    const rows = folderId
      ? await sql<{
          id: number;
          folder_id: number | null;
          title: string;
          kind: string;
          content: string;
          mime: string | null;
          created_by: string;
          updated_at: unknown;
          created_at: unknown;
        }>`
          select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
          from documents
          where workspace_id = ${membership.workspace_id} and folder_id = ${folderId}
          order by updated_at desc
        `
      : await sql<{
          id: number;
          folder_id: number | null;
          title: string;
          kind: string;
          content: string;
          mime: string | null;
          created_by: string;
          updated_at: unknown;
          created_at: unknown;
        }>`
          select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
          from documents
          where workspace_id = ${membership.workspace_id}
          order by updated_at desc
        `;
    const nameMap = await namesById(
      sql,
      rows.map((r) => r.created_by),
    );
    return rows.map((r) => ({
      id: r.id,
      folderId: r.folder_id,
      title: r.title,
      kind: (["note", "web", "image", "file", "board"].includes(r.kind)
        ? r.kind
        : "note") as DocumentItem["kind"],
      content: r.content,
      mime: r.mime,
      createdBy: r.created_by,
      authorName: nameMap.get(r.created_by) || "สมาชิก",
      updatedAt: iso(r.updated_at),
      createdAt: iso(r.created_at),
    }));
  });

export const getDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }): Promise<DocumentItem> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const rows = await sql<{
      id: number;
      folder_id: number | null;
      title: string;
      kind: string;
      content: string;
      mime: string | null;
      created_by: string;
      updated_at: unknown;
      created_at: unknown;
    }>`
      select id, folder_id, title, kind, content, mime, created_by, updated_at, created_at
      from documents
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `;
    const r = rows[0];
    if (!r) throw new Error("ไม่พบเอกสาร");
    const nameMap = await namesById(sql, [r.created_by]);
    return {
      id: r.id,
      folderId: r.folder_id,
      title: r.title,
      kind: (["note", "web", "image", "file", "board"].includes(r.kind)
        ? r.kind
        : "note") as DocumentItem["kind"],
      content: r.content,
      mime: r.mime,
      createdBy: r.created_by,
      authorName: nameMap.get(r.created_by) || "สมาชิก",
      updatedAt: iso(r.updated_at),
      createdAt: iso(r.created_at),
    };
  });

export const saveDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number().optional(),
      folderId: z.number().nullable().optional(),
      title: z.string().trim().min(1).max(120),
      kind: z.enum(["note", "web", "image", "file", "board"]),
      content: z.string().max(900_000),
      mime: z.string().max(120).nullable().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    if (data.id) {
      const updated = await sql<{ id: number }>`
        update documents
        set title = ${data.title},
            content = ${data.content},
            mime = ${data.mime ?? null},
            updated_at = now()
        where id = ${data.id} and workspace_id = ${membership.workspace_id}
        returning id
      `;
      if (!updated[0]) throw new Error("ไม่พบเอกสาร");
      await logActivity(
        sql,
        membership.workspace_id,
        context.userId,
        "edit_doc",
        `แก้ ${data.title}`,
      );
      return { id: updated[0].id };
    }
    const inserted = await sql<{ id: number }>`
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
    `;
    const id = inserted[0]?.id;
    if (!id) throw new Error("บันทึกไม่สำเร็จ");
    await logActivity(
      sql,
      membership.workspace_id,
      context.userId,
      "add_doc",
      `เพิ่ม ${data.title}`,
    );
    return { id };
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    await sql`
      delete from documents
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `;
    return { ok: true as const };
  });

function mapReport(row: {
  id: number;
  title: string;
  work_date: unknown;
  summary: string;
  next_plan: string;
  hours: string | null;
  items: unknown;
  created_by: string;
  created_at: unknown;
  updated_at: unknown;
  authorName: string;
}): Report {
  return {
    id: row.id,
    title: row.title,
    workDate: iso(row.work_date).slice(0, 10),
    summary: row.summary,
    nextPlan: row.next_plan,
    hours: row.hours,
    items: parseJson<ReportItem[]>(row.items, []),
    createdBy: row.created_by,
    authorName: row.authorName,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export const listReports = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Report[]> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const rows = await sql<{
      id: number;
      title: string;
      work_date: unknown;
      summary: string;
      next_plan: string;
      hours: string | null;
      items: unknown;
      created_by: string;
      created_at: unknown;
      updated_at: unknown;
    }>`
      select id, title, work_date, summary, next_plan, hours, items, created_by, created_at, updated_at
      from reports
      where workspace_id = ${membership.workspace_id}
      order by work_date desc, id desc
    `;
    const nameMap = await namesById(
      sql,
      rows.map((r) => r.created_by),
    );
    return rows.map((r) =>
      mapReport({ ...r, authorName: nameMap.get(r.created_by) || "สมาชิก" }),
    );
  });

export const saveReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number().optional(),
      title: z.string().trim().min(1).max(120),
      workDate: z.string().min(8).max(10),
      summary: z.string().max(4000),
      nextPlan: z.string().max(2000),
      hours: z.string().max(12).nullable().optional(),
      items: z
        .array(
          z.object({
            task: z.string().trim().min(1).max(200),
            status: z.enum(["done", "doing", "blocked", "wait"]),
            note: z.string().max(400),
          }),
        )
        .max(40),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const itemsJson = JSON.stringify(data.items);
    if (data.id) {
      const updated = await sql<{ id: number }>`
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
      await logActivity(
        sql,
        membership.workspace_id,
        context.userId,
        "edit_report",
        `แก้รายงาน ${data.title}`,
      );
      return { id: updated[0].id };
    }
    const inserted = await sql<{ id: number }>`
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
    `;
    const id = inserted[0]?.id;
    if (!id) throw new Error("บันทึกไม่สำเร็จ");
    await logActivity(
      sql,
      membership.workspace_id,
      context.userId,
      "add_report",
      `สร้างรายงาน ${data.title}`,
    );
    return { id };
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    await sql`
      delete from reports
      where id = ${data.id} and workspace_id = ${membership.workspace_id}
    `;
    return { ok: true as const };
  });

export const getBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BoardState> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const rows = await sql<{
      strokes: unknown;
      notes: unknown;
      updated_at: unknown;
      updated_by: string | null;
    }>`
      select strokes, notes, updated_at, updated_by from boards where workspace_id = ${membership.workspace_id}
    `;
    const row = rows[0];
    if (!row) {
      return { strokes: [], notes: [], updatedAt: new Date().toISOString(), updatedBy: null };
    }
    return {
      strokes: parseJson<Stroke[]>(row.strokes, []),
      notes: parseJson<StickyNote[]>(row.notes, []),
      updatedAt: iso(row.updated_at),
      updatedBy: row.updated_by,
    };
  });

export const saveBoard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      strokes: z.array(z.any()).max(800),
      notes: z.array(z.any()).max(80),
    }),
  )
  .handler(async ({ context, data }) => {
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
    return { ok: true as const, updatedAt: new Date().toISOString() };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Dashboard> => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    const ws = membership.workspace_id;
    const [files, messages, reports, board, recent] = await Promise.all([
      sql<{ n: number }>`select count(*)::int as n from documents where workspace_id = ${ws}`,
      sql<{ n: number }>`select count(*)::int as n from messages where workspace_id = ${ws}`,
      sql<{ n: number }>`select count(*)::int as n from reports where workspace_id = ${ws}`,
      sql<{ n: number }>`
        select count(*)::int as n from activities
        where workspace_id = ${ws} and action in ('board', 'board_snap')
      `,
      sql<{
        id: number;
        user_id: string;
        action: string;
        detail: string;
        created_at: unknown;
      }>`
        select id, user_id, action, detail, created_at
        from activities
        where workspace_id = ${ws}
        order by id desc
        limit 8
      `,
    ]);
    const reportRows = await sql<{ items: unknown; work_date: unknown }>`
      select items, work_date from reports where workspace_id = ${ws}
    `;
    let doneThisWeek = 0;
    let doingThisWeek = 0;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const trendMap = new Map<string, number>();
    for (const r of reportRows) {
      const items = parseJson<ReportItem[]>(r.items, []);
      const d = iso(r.work_date).slice(0, 10);
      trendMap.set(d, (trendMap.get(d) ?? 0) + 1);
      const t = new Date(d + "T00:00:00").getTime();
      if (t >= weekAgo) {
        for (const it of items) {
          if (it.status === "done") doneThisWeek += 1;
          if (it.status === "doing") doingThisWeek += 1;
        }
      }
    }
    const kinds = await sql<{ kind: string; count: number }>`
      select kind, count(*)::int as count from documents
      where workspace_id = ${ws}
      group by kind
    `;
    const nameMap = await namesById(
      sql,
      recent.map((r) => r.user_id),
    );
    const recentMapped: Activity[] = recent.map((r) => ({
      id: r.id,
      userId: r.user_id,
      authorName: nameMap.get(r.user_id) || "สมาชิก",
      action: r.action,
      detail: r.detail,
      createdAt: iso(r.created_at),
    }));
    const reportTrend = [...trendMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, count]) => ({ date, count }));
    return {
      files: files[0]?.n ?? 0,
      messages: messages[0]?.n ?? 0,
      reports: reports[0]?.n ?? 0,
      boardUpdates: board[0]?.n ?? 0,
      doneThisWeek,
      doingThisWeek,
      recent: recentMapped,
      reportTrend,
      fileKinds: kinds,
    };
  });

export const logBoardActivity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ detail: z.string().max(120) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const membership = await requireWorkspace(sql, context.userId);
    await logActivity(
      sql,
      membership.workspace_id,
      context.userId,
      "board",
      data.detail,
    );
    return { ok: true as const };
  });
