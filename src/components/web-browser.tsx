import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookmarkPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebFrame, normalizeUrl } from "@/components/web-frame";
import { listFolders, saveDocument } from "@/lib/server/api";

const STARTERS = [
  { label: "Google Docs", url: "https://docs.google.com" },
  { label: "Google Drive", url: "https://drive.google.com" },
  { label: "LINE OA", url: "https://manager.line.biz" },
  { label: "Notion", url: "https://www.notion.so" },
];

export function WebBrowser({ initialUrl = "" }: { initialUrl?: string }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(initialUrl);
  const [active, setActive] = useState(initialUrl);
  const href = useMemo(() => normalizeUrl(active), [active]);
  const foldersQ = useQuery({ queryKey: ["folders"], queryFn: () => listFolders() });

  const save = useMutation({
    mutationFn: async () => {
      if (!href) throw new Error("ลิงก์ไม่ถูกต้อง");
      const folderId = foldersQ.data?.find((f) => f.name.includes("ลิงก์"))?.id ?? null;
      return saveDocument({
        data: {
          folderId,
          title: href.replace(/^https?:\/\//, "").slice(0, 80),
          kind: "web",
          content: href,
          mime: "text/uri-list",
        },
      });
    },
    onSuccess: (res) => {
      toast.success("เก็บลิงก์เข้าลิ้นชักแล้ว");
      void navigate({ to: "/files/$docId", params: { docId: String(res.id) } });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function go(raw = input) {
    const next = normalizeUrl(raw);
    if (!next) {
      toast.error("ใส่ลิงก์ให้ถูกต้อง");
      return;
    }
    setInput(next);
    setActive(next);
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-semibold">เปิดเว็บทุกชนิด</h1>
      <p className="mt-1 text-xs text-muted">
        วางลิงก์เอกสาร ชีต PDF หรืองานในไลน์ OA แล้วเก็บเข้าลิ้นชักได้
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="วางลิงก์ https://"
          inputMode="url"
        />
        <Button type="submit">เปิด</Button>
      </form>
      <div className="mt-3 flex gap-1.5 overflow-x-auto">
        {STARTERS.map((s) => (
          <button
            key={s.url}
            type="button"
            onClick={() => go(s.url)}
            className="h-9 shrink-0 rounded-full bg-surface px-3 text-xs font-medium shadow-lift"
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Button
          variant="secondary"
          className="w-full"
          disabled={!href || save.isPending}
          onClick={() => save.mutate()}
        >
          <BookmarkPlus />
          เก็บลิงก์นี้เข้าลิ้นชัก
        </Button>
      </div>
      <div className="mt-4">
        <WebFrame url={active} />
      </div>
    </div>
  );
}
