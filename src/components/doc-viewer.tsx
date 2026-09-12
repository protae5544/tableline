import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LineShareActions } from "@/components/line-share";
import { WebFrame } from "@/components/web-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { deleteDocument, getDocument, saveDocument } from "@/lib/server/api";

export function DocViewer({ docId }: { docId: number }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["doc", docId],
    queryFn: () => getDocument({ data: { id: docId } }),
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!q.data) return;
    setTitle(q.data.title);
    setContent(q.data.content);
  }, [q.data]);

  const save = useMutation({
    mutationFn: () =>
      saveDocument({
        data: {
          id: docId,
          title: title.trim() || "ไม่มีชื่อ",
          kind: q.data?.kind ?? "note",
          content,
          mime: q.data?.mime ?? null,
        },
      }),
    onSuccess: async () => {
      toast.success("บันทึกแล้ว");
      await qc.invalidateQueries({ queryKey: ["doc", docId] });
      await qc.invalidateQueries({ queryKey: ["docs"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteDocument({ data: { id: docId } }),
    onSuccess: async () => {
      toast.success("ลบแล้ว");
      await qc.invalidateQueries({ queryKey: ["docs"] });
      await navigate({ to: "/files" });
    },
  });

  if (q.isPending) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="p-6">
        <p>ไม่พบเอกสาร</p>
        <Link to="/files" className="mt-3 inline-block text-line">
          กลับลิ้นชัก
        </Link>
      </div>
    );
  }

  const doc = q.data;
  const shareText = `${doc.title}\n\n${doc.kind === "web" ? doc.content : doc.content.slice(0, 1800)}`;

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => void navigate({ to: "/files" })}
          aria-label="กลับ"
        >
          <ArrowLeft />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-medium"
        />
        <Button
          size="icon"
          variant="ghost"
          aria-label="ลบ"
          onClick={() => {
            if (window.confirm("ลบเอกสารนี้?")) remove.mutate();
          }}
        >
          <Trash2 />
        </Button>
      </div>

      {doc.kind === "web" ? (
        <div className="space-y-3">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            inputMode="url"
          />
          <WebFrame url={content} />
        </div>
      ) : doc.kind === "image" ? (
        <img
          src={content}
          alt={title}
          className="w-full rounded-2xl bg-surface object-contain"
        />
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[50vh] font-mono text-sm"
        />
      )}

      <div className="mt-4 space-y-2">
        {doc.kind !== "image" ? (
          <Button className="w-full" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        ) : null}
        <LineShareActions text={shareText} />
      </div>
    </div>
  );
}
