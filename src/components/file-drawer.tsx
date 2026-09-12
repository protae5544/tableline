import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  FolderPlus,
  Globe,
  Image as ImageIcon,
  Link2,
  Plus,
  StickyNote,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { relativeThai } from "@/lib/format";
import {
  createFolder,
  listDocuments,
  listFolders,
  saveDocument,
} from "@/lib/server/api";
import type { DocKind, DocumentItem, Folder } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FileDrawer() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [folderId, setFolderId] = useState<number | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);

  const foldersQ = useQuery({ queryKey: ["folders"], queryFn: () => listFolders() });
  const docsQ = useQuery({
    queryKey: ["docs", folderId],
    queryFn: () =>
      listDocuments({
        data: { folderId: folderId === "all" ? null : folderId },
      }),
  });

  const docs = docsQ.data ?? [];
  const folders = foldersQ.data ?? [];

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">ลิ้นชักเอกสาร</h1>
          <p className="text-xs text-muted">เก็บโน้ต ลิงก์เว็บ รูป และไฟล์ แล้วเปิดได้ทันที</p>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" onClick={() => setFolderOpen(true)} aria-label="ลิ้นชักใหม่">
            <FolderPlus />
          </Button>
          <Button size="icon" onClick={() => setCreateOpen(true)} aria-label="สร้างเอกสาร">
            <Plus />
          </Button>
        </div>
      </div>

      <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto pb-1">
        <Chip active={folderId === "all"} onClick={() => setFolderId("all")}>
          ทั้งหมด
        </Chip>
        {folders.map((f) => (
          <Chip key={f.id} active={folderId === f.id} onClick={() => setFolderId(f.id)}>
            {f.name} {f.docCount}
          </Chip>
        ))}
      </div>

      {docsQ.isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : docs.length === 0 ? (
        <EmptyFiles onCreate={() => setCreateOpen(true)} />
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() =>
                  navigate({ to: "/files/$docId", params: { docId: String(doc.id) } })
                }
                className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-mint text-line-dark">
                  <KindIcon kind={doc.kind} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{doc.title}</span>
                  <span className="block text-xs text-muted">
                    {kindLabel(doc.kind)} · {doc.authorName} · {relativeThai(doc.updatedAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <CreateDocDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        folders={folders}
        defaultFolderId={folderId === "all" ? folders[0]?.id : folderId}
        onCreated={(id) => {
          void qc.invalidateQueries({ queryKey: ["docs"] });
          void qc.invalidateQueries({ queryKey: ["folders"] });
          void navigate({ to: "/files/$docId", params: { docId: String(id) } });
        }}
      />
      <CreateFolderDialog
        open={folderOpen}
        onOpenChange={setFolderOpen}
        onCreated={() => {
          void qc.invalidateQueries({ queryKey: ["folders"] });
        }}
      />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-xs font-medium",
        active ? "bg-line text-on-line" : "bg-surface text-muted shadow-lift",
      )}
    >
      {children}
    </button>
  );
}

function KindIcon({ kind }: { kind: DocKind }) {
  if (kind === "web") return <Globe className="size-5" />;
  if (kind === "image") return <ImageIcon className="size-5" />;
  if (kind === "board") return <StickyNote className="size-5" />;
  return <FileText className="size-5" />;
}

function kindLabel(kind: DocKind) {
  return { note: "โน้ต", web: "เว็บ", image: "รูป", file: "ไฟล์", board: "บอร์ด" }[kind];
}

function EmptyFiles({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl bg-surface px-5 py-10 text-center shadow-lift">
      <p className="font-medium">ลิ้นชักนี้ยังว่าง</p>
      <p className="mt-1 text-sm text-muted">สร้างโน้ต วางลิงก์เว็บ หรืออัปโหลดไฟล์ได้เลย</p>
      <Button className="mt-4" onClick={onCreate}>
        สร้างเอกสาร
      </Button>
    </div>
  );
}

function CreateFolderDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const mut = useMutation({
    mutationFn: () => createFolder({ data: { name } }),
    onSuccess: () => {
      toast.success("สร้างลิ้นชักแล้ว");
      setName("");
      onOpenChange(false);
      onCreated();
    },
    onError: (err: Error) => toast.error(err.message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ลิ้นชักใหม่</DialogTitle>
          <DialogDescription>แยกเอกสารตามงาน เช่น ของเจ้านาย หรือของลูกค้า</DialogDescription>
        </DialogHeader>
        <Label htmlFor="folder-name">ชื่อลิ้นชัก</Label>
        <Input id="folder-name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button disabled={!name.trim() || mut.isPending} onClick={() => mut.mutate()}>
          สร้าง
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function CreateDocDialog({
  open,
  onOpenChange,
  folders,
  defaultFolderId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  folders: Folder[];
  defaultFolderId?: number;
  onCreated: (id: number) => void;
}) {
  const [kind, setKind] = useState<DocKind>("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState<number | undefined>(defaultFolderId);
  const [busy, setBusy] = useState(false);

  const kinds = useMemo(
    () =>
      [
        { id: "note" as const, label: "โน้ต", icon: FileText },
        { id: "web" as const, label: "ลิงก์เว็บ", icon: Link2 },
        { id: "file" as const, label: "ไฟล์ข้อความ", icon: FileText },
        { id: "image" as const, label: "รูป", icon: ImageIcon },
      ] as const,
    [],
  );

  async function create() {
    setBusy(true);
    try {
      const res = await saveDocument({
        data: {
          folderId: folderId ?? null,
          title: title.trim() || (kind === "web" ? content : "ไม่มีชื่อ"),
          kind,
          content: content.trim(),
          mime: kind === "web" ? "text/uri-list" : "text/plain",
        },
      });
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

  async function onFile(file: File) {
    setBusy(true);
    try {
      if (file.size > 700_000) {
        toast.error("ไฟล์ใหญ่เกิน 700KB — วางลิงก์แทน");
        return;
      }
      const isImage = file.type.startsWith("image/");
      const textLike =
        file.type.startsWith("text/") ||
        /\.(txt|md|csv|json|html|xml)$/i.test(file.name);
      let body = "";
      let nextKind: DocKind = "file";
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
      const res = await saveDocument({
        data: {
          folderId: folderId ?? null,
          title: title.trim() || file.name,
          kind: nextKind,
          content: body,
          mime,
        },
      });
      toast.success("เก็บไฟล์แล้ว");
      onOpenChange(false);
      onCreated(res.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สร้างหรือเก็บเอกสาร</DialogTitle>
          <DialogDescription>โน้ต ลิงก์เว็บ รูป หรือไฟล์ข้อความ</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {kinds.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium",
                kind === k.id ? "bg-mint text-line-dark" : "bg-page text-muted",
              )}
            >
              <k.icon className="size-4" />
              {k.label}
            </button>
          ))}
        </div>
        {folders.length > 0 ? (
          <div>
            <Label htmlFor="doc-folder">ลิ้นชัก</Label>
            <select
              id="doc-folder"
              className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3"
              value={folderId ?? ""}
              onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : undefined)}
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <Label htmlFor="doc-title">ชื่อ</Label>
          <Input
            id="doc-title"
            className="mt-1.5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ชื่องาน"
          />
        </div>
        {kind === "image" || kind === "file" ? (
          <div>
            <Label htmlFor="doc-file">เลือกไฟล์จากเครื่อง</Label>
            <Input
              id="doc-file"
              className="mt-1.5"
              type="file"
              accept={kind === "image" ? "image/*" : "*/*"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
              }}
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="doc-body">{kind === "web" ? "ลิงก์เว็บ" : "เนื้อหา"}</Label>
            {kind === "web" ? (
              <Input
                id="doc-body"
                className="mt-1.5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://"
                inputMode="url"
              />
            ) : (
              <Textarea
                id="doc-body"
                className="mt-1.5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="พิมพ์โน้ต"
              />
            )}
          </div>
        )}
        {kind === "note" || kind === "web" ? (
          <Button disabled={busy} onClick={() => void create()}>
            {busy ? "กำลังเก็บ..." : "เก็บเข้าลิ้นชัก"}
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
}
