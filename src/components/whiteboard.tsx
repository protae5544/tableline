import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Eraser,
  Highlighter,
  ImageDown,
  PenLine,
  StickyNote as StickyIcon,
  Trash2,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBoard, logBoardActivity, saveBoard, saveDocument } from "@/lib/server/api";
import type { StickyNote, Stroke } from "@/lib/types";
import { cn, shortId } from "@/lib/utils";

const COLORS = ["#111111", "#06C755", "#E11D48", "#2563EB", "#D97706"] as const;

type Tool = "pen" | "highlighter" | "eraser" | "sticky";

export function Whiteboard({ userId }: { userId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef<Stroke | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [stickyDraft, setStickyDraft] = useState<{ x: number; y: number } | null>(null);
  const [stickyText, setStickyText] = useState("");
  const hydrated = useRef(false);
  const dirty = useRef(false);

  const boardQ = useQuery({
    queryKey: ["board"],
    queryFn: () => getBoard(),
    refetchInterval: 2800,
  });

  useEffect(() => {
    const data = boardQ.data;
    if (!data) return;
    if (drawing.current) return;
    if (!hydrated.current) {
      setStrokes(data.strokes);
      setNotes(data.notes);
      hydrated.current = true;
      return;
    }
    setStrokes((local) => mergeById(data.strokes, local));
    setNotes((local) => mergeById(data.notes, local));
  }, [boardQ.data]);

  const persist = useMutation({
    mutationFn: (payload: { strokes: Stroke[]; notes: StickyNote[] }) =>
      saveBoard({ data: payload }),
  });

  const flush = useCallback(
    (nextStrokes: Stroke[], nextNotes: StickyNote[]) => {
      dirty.current = false;
      persist.mutate({ strokes: nextStrokes, notes: nextNotes });
    },
    [persist],
  );

  useEffect(() => {
    if (!hydrated.current) return;
    dirty.current = true;
    const t = window.setTimeout(() => flush(strokes, notes), 700);
    return () => window.clearTimeout(t);
  }, [strokes, notes, flush]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f7f8fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes) drawStroke(ctx, s, canvas.width, canvas.height);
    if (drawing.current) drawStroke(ctx, drawing.current, canvas.width, canvas.height);
  }, [strokes]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      paint();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  useEffect(() => {
    paint();
  }, [paint]);

  function normPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = normPoint(e);
    if (tool === "sticky") {
      setStickyDraft(p);
      setStickyText("");
      return;
    }
    drawing.current = {
      id: shortId("sk"),
      userId,
      tool: tool === "eraser" ? "eraser" : tool === "highlighter" ? "highlighter" : "pen",
      color: tool === "eraser" ? "#f7f8fa" : color,
      width: tool === "highlighter" ? 28 : tool === "eraser" ? 22 : 4,
      points: [p],
      t: Date.now(),
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current.points.push(normPoint(e));
    paint();
  }

  function onPointerUp() {
    if (!drawing.current) return;
    const done = drawing.current;
    drawing.current = null;
    if (done.points.length < 1) return;
    setStrokes((prev) => [...prev, done]);
  }

  function undo() {
    setStrokes((prev) => {
      const idx = [...prev].reverse().findIndex((s) => s.userId === userId);
      if (idx < 0) return prev;
      const at = prev.length - 1 - idx;
      return prev.filter((_, i) => i !== at);
    });
  }

  function clearAll() {
    if (!window.confirm("ล้างบอร์ดทั้งแผ่น?")) return;
    setStrokes([]);
    setNotes([]);
    void logBoardActivity({ data: { detail: "ล้างบอร์ด" } });
  }

  async function snapshot() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.55);
    if (dataUrl.length > 850_000) {
      toast.error("ภาพบอร์ดใหญ่เกินไป ลองล้างบางส่วนก่อน");
      return;
    }
    try {
      await saveDocument({
        data: {
          title: `บอร์ด ${new Date().toLocaleString("th-TH")}`,
          kind: "image",
          content: dataUrl,
          mime: "image/jpeg",
        },
      });
      await logBoardActivity({ data: { detail: "บันทึกภาพบอร์ดเข้าลิ้นชัก" } });
      toast.success("เก็บภาพบอร์ดเข้าลิ้นชักแล้ว");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    }
  }

  function addSticky() {
    if (!stickyDraft || !stickyText.trim()) {
      setStickyDraft(null);
      return;
    }
    setNotes((prev) => [
      ...prev,
      {
        id: shortId("nt"),
        userId,
        x: stickyDraft.x,
        y: stickyDraft.y,
        text: stickyText.trim(),
        color: "#fff4b8",
        t: Date.now(),
      },
    ]);
    setStickyDraft(null);
    setStickyText("");
    setTool("pen");
  }

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] flex-col">
      <div className="flex items-center gap-1 overflow-x-auto bg-surface px-2 py-2">
        <ToolBtn active={tool === "pen"} onClick={() => setTool("pen")} label="ปากกา">
          <PenLine className="size-4" />
        </ToolBtn>
        <ToolBtn
          active={tool === "highlighter"}
          onClick={() => setTool("highlighter")}
          label="เน้น"
        >
          <Highlighter className="size-4" />
        </ToolBtn>
        <ToolBtn active={tool === "eraser"} onClick={() => setTool("eraser")} label="ลบ">
          <Eraser className="size-4" />
        </ToolBtn>
        <ToolBtn active={tool === "sticky"} onClick={() => setTool("sticky")} label="โน้ต">
          <StickyIcon className="size-4" />
        </ToolBtn>
        <div className="mx-1 h-6 w-px bg-border" />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => {
              setColor(c);
              setTool("pen");
            }}
            className={cn(
              "size-8 shrink-0 rounded-full border-2",
              color === c && tool !== "eraser" ? "border-ink" : "border-transparent",
            )}
            style={{ background: c }}
          />
        ))}
        <div className="ml-auto flex gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={undo} aria-label="เลิกทำ">
            <Undo2 />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => void snapshot()} aria-label="เก็บภาพ">
            <ImageDown />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={clearAll} aria-label="ล้างบอร์ด">
            <Trash2 />
          </Button>
        </div>
      </div>

      <div ref={wrapRef} className="relative min-h-0 flex-1 touch-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {notes.map((n) => (
          <div
            key={n.id}
            className="absolute w-28 rounded-md p-2 text-xs shadow-lift"
            style={{
              left: `${n.x * 100}%`,
              top: `${n.y * 100}%`,
              background: n.color,
              transform: "translate(-10%, -10%)",
            }}
          >
            {n.text}
          </div>
        ))}
        {stickyDraft ? (
          <div
            className="absolute w-40 rounded-xl bg-sticky p-2 shadow-lift"
            style={{
              left: `${stickyDraft.x * 100}%`,
              top: `${stickyDraft.y * 100}%`,
            }}
          >
            <textarea
              autoFocus
              value={stickyText}
              onChange={(e) => setStickyText(e.target.value)}
              onBlur={addSticky}
              placeholder="โน้ตสั้นๆ"
              className="h-20 w-full resize-none bg-transparent text-sm outline-none"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 min-w-11 shrink-0 flex-col items-center justify-center rounded-xl px-2 text-[10px]",
        active ? "bg-mint text-line-dark" : "text-muted",
      )}
    >
      {children}
      {label}
    </button>
  );
}

function drawStroke(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  w: number,
  h: number,
) {
  if (s.points.length === 0) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = s.width * (w / 420);
  if (s.tool === "highlighter") {
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = s.color;
  } else if (s.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.strokeStyle = s.color;
  }
  ctx.beginPath();
  ctx.moveTo(s.points[0]!.x * w, s.points[0]!.y * h);
  for (let i = 1; i < s.points.length; i++) {
    ctx.lineTo(s.points[i]!.x * w, s.points[i]!.y * h);
  }
  ctx.stroke();
  ctx.restore();
}

function mergeById<T extends { id: string; t: number }>(remote: T[], local: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of remote) map.set(item.id, item);
  for (const item of local) map.set(item.id, item);
  return [...map.values()].sort((a, b) => a.t - b.t);
}
