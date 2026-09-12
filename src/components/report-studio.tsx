import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { LineShareActions } from "@/components/line-share";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { todayISO } from "@/lib/format";
import { formatThaiDate, reportToLineText } from "@/lib/line";
import {
  deleteReport,
  getDashboard,
  listReports,
  saveReport,
  sendMessage,
} from "@/lib/server/api";
import type { Report, ReportItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: { id: ReportItem["status"]; label: string }[] = [
  { id: "done", label: "เสร็จ" },
  { id: "doing", label: "ทำอยู่" },
  { id: "wait", label: "รอ" },
  { id: "blocked", label: "ติดปัญหา" },
];

export function ReportStudio({ authorName }: { authorName: string }) {
  const qc = useQueryClient();
  const reportsQ = useQuery({ queryKey: ["reports"], queryFn: () => listReports() });
  const dashQ = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const [editing, setEditing] = useState<Partial<Report> | null>(null);

  const reports = reportsQ.data ?? [];

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">รายงานและแดชบอร์ด</h1>
          <p className="text-xs text-muted">สร้างรายงานแล้วส่งเข้าไลน์เป็นข้อความที่เจ้านายอ่านได้ทันที</p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            setEditing({
              title: "รายงานประจำวัน",
              workDate: todayISO(),
              summary: "",
              nextPlan: "",
              hours: "",
              items: [{ task: "", status: "doing", note: "" }],
            })
          }
        >
          <Plus />
          สร้าง
        </Button>
      </div>

      {dashQ.data ? <DashCharts dash={dashQ.data} /> : <Skeleton className="mb-4 h-40 w-full" />}

      {editing ? (
        <ReportForm
          value={editing}
          authorName={authorName}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await qc.invalidateQueries({ queryKey: ["reports"] });
            await qc.invalidateQueries({ queryKey: ["dashboard"] });
          }}
        />
      ) : null}

      <div className="mt-4 space-y-3">
        {reportsQ.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : reports.length === 0 && !editing ? (
          <div className="rounded-2xl bg-surface px-5 py-10 text-center shadow-lift">
            <p className="font-medium">ยังไม่มีรายงาน</p>
            <p className="mt-1 text-sm text-muted">สร้างรายงานแรก แล้วส่งเข้าไลน์ให้เจ้านาย</p>
          </div>
        ) : (
          reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              authorName={authorName}
              onEdit={() => setEditing(r)}
              onDeleted={async () => {
                await qc.invalidateQueries({ queryKey: ["reports"] });
                await qc.invalidateQueries({ queryKey: ["dashboard"] });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DashCharts({
  dash,
}: {
  dash: {
    files: number;
    messages: number;
    reports: number;
    doneThisWeek: number;
    doingThisWeek: number;
    reportTrend: { date: string; count: number }[];
    fileKinds: { kind: string; count: number }[];
    recent: { id: number; detail: string; authorName: string }[];
  };
}) {
  const trend = dash.reportTrend.map((d) => ({
    ...d,
    label: d.date.slice(5),
  }));
  const kinds = dash.fileKinds.map((k) => ({
    ...k,
    name: ({ note: "โน้ต", web: "เว็บ", image: "รูป", file: "ไฟล์", board: "บอร์ด" } as Record<string, string>)[
      k.kind
    ] ?? k.kind,
  }));
  const pieColors = ["#06C755", "#8BABD9", "#111111", "#D97706", "#E11D48"];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["ไฟล์ในลิ้นชัก", dash.files],
          ["ข้อความในห้อง", dash.messages],
          ["รายงานทั้งหมด", dash.reports],
          ["งานเสร็จสัปดาห์นี้", dash.doneThisWeek],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl bg-surface p-3 shadow-lift">
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-[11px] text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-surface p-3 shadow-lift">
          <p className="mb-2 text-sm font-medium">จำนวนรายงานตามวัน</p>
          <div className="h-40">
            {trend.length === 0 ? (
              <p className="grid h-full place-items-center text-xs text-muted">ยังไม่มีข้อมูลกราฟ</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend}>
                  <CartesianGrid stroke="#E4E7EC" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#98A2B3" />
                  <YAxis allowDecimals={false} width={24} tick={{ fontSize: 11 }} stroke="#98A2B3" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06C755" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-surface p-3 shadow-lift">
          <p className="mb-2 text-sm font-medium">ชนิดไฟล์ในลิ้นชัก</p>
          <div className="h-40">
            {kinds.length === 0 ? (
              <p className="grid h-full place-items-center text-xs text-muted">ยังไม่มีไฟล์</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={kinds} dataKey="count" nameKey="name" innerRadius={32} outerRadius={58}>
                    {kinds.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      {dash.recent.length > 0 ? (
        <div className="rounded-2xl bg-surface p-3 shadow-lift">
          <p className="mb-2 text-sm font-medium">กิจกรรมล่าสุด</p>
          <ul className="space-y-1.5">
            {dash.recent.map((a) => (
              <li key={a.id} className="text-xs text-muted">
                <span className="font-medium text-ink">{a.authorName}</span> {a.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ReportCard({
  report,
  authorName,
  onEdit,
  onDeleted,
}: {
  report: Report;
  authorName: string;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const text = reportToLineText(report, report.authorName || authorName);
  const done = report.items.filter((i) => i.status === "done").length;
  return (
    <article className="rounded-2xl bg-surface p-4 shadow-lift">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{report.title}</p>
          <p className="text-xs text-muted">
            {formatThaiDate(report.workDate)} · {report.authorName} · {done}/{report.items.length} เสร็จ
          </p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            แก้
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="ลบ"
            onClick={() => {
              if (!window.confirm("ลบรายงานนี้?")) return;
              void deleteReport({ data: { id: report.id } }).then(onDeleted);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <ul className="mt-3 space-y-1">
        {report.items.slice(0, 4).map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <StatusPill status={item.status} />
            <span className="truncate">{item.task}</span>
          </li>
        ))}
      </ul>
      <LineShareActions text={text} compact className="mt-3" />
    </article>
  );
}

function StatusPill({ status }: { status: ReportItem["status"] }) {
  const map = {
    done: { label: "เสร็จ", variant: "default" as const },
    doing: { label: "ทำอยู่", variant: "line" as const },
    wait: { label: "รอ", variant: "muted" as const },
    blocked: { label: "ติดปัญหา", variant: "danger" as const },
  };
  const s = map[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function ReportForm({
  value,
  authorName,
  onClose,
  onSaved,
}: {
  value: Partial<Report>;
  authorName: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(value.title ?? "รายงานประจำวัน");
  const [workDate, setWorkDate] = useState(value.workDate ?? todayISO());
  const [summary, setSummary] = useState(value.summary ?? "");
  const [nextPlan, setNextPlan] = useState(value.nextPlan ?? "");
  const [hours, setHours] = useState(value.hours ?? "");
  const [items, setItems] = useState<ReportItem[]>(
    value.items?.length ? value.items : [{ task: "", status: "doing", note: "" }],
  );

  const preview = useMemo(() => {
    const fake: Report = {
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
      updatedAt: "",
    };
    return reportToLineText(fake, authorName);
  }, [authorName, hours, items, nextPlan, summary, title, value.id, workDate]);

  const save = useMutation({
    mutationFn: () =>
      saveReport({
        data: {
          id: value.id,
          title: title.trim(),
          workDate,
          summary,
          nextPlan,
          hours: hours.trim() || null,
          items: items.filter((i) => i.task.trim()),
        },
      }),
    onSuccess: async (res) => {
      toast.success("บันทึกรายงานแล้ว");
      await sendMessage({
        data: {
          body: `ส่งรายงาน: ${title}`,
          kind: "report",
          refId: String(res.id),
        },
      }).catch(() => undefined);
      onSaved();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mb-4 space-y-3 rounded-2xl bg-surface p-4 shadow-lift">
      <div className="flex items-center justify-between">
        <p className="font-medium">{value.id ? "แก้รายงาน" : "รายงานใหม่"}</p>
        <button type="button" className="text-sm text-muted" onClick={onClose}>
          ปิด
        </button>
      </div>
      <div>
        <Label htmlFor="r-title">เรื่อง</Label>
        <Input id="r-title" className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="r-date">วันที่</Label>
          <Input
            id="r-date"
            type="date"
            className="mt-1.5"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="r-hours">ชั่วโมง (ถ้ามี)</Label>
          <Input
            id="r-hours"
            className="mt-1.5"
            value={hours ?? ""}
            onChange={(e) => setHours(e.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>รายการงาน</Label>
        {items.map((item, i) => (
          <div key={i} className="rounded-xl bg-page p-2.5">
            <Input
              value={item.task}
              onChange={(e) =>
                setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, task: e.target.value } : it)))
              }
              placeholder="ชื่องาน"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {STATUS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((it, idx) => (idx === i ? { ...it, status: s.id } : it)),
                    )
                  }
                  className={cn(
                    "h-8 rounded-full px-2.5 text-[11px] font-medium",
                    item.status === s.id ? "bg-line text-on-line" : "bg-surface text-muted",
                  )}
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                className="ml-auto text-xs text-danger"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              >
                ลบรายการ
              </button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setItems((prev) => [...prev, { task: "", status: "doing", note: "" }])}
        >
          <Plus />
          เพิ่มรายการ
        </Button>
      </div>
      <div>
        <Label htmlFor="r-sum">สรุปให้เจ้านาย</Label>
        <Textarea
          id="r-sum"
          className="mt-1.5"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="วันนี้ทำอะไรไปบ้าง"
        />
      </div>
      <div>
        <Label htmlFor="r-next">งานถัดไป</Label>
        <Textarea
          id="r-next"
          className="mt-1.5"
          value={nextPlan}
          onChange={(e) => setNextPlan(e.target.value)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted">ตัวอย่างข้อความที่จะเข้าไลน์</p>
        <pre className="max-h-40 overflow-auto rounded-xl bg-page p-3 text-xs leading-relaxed whitespace-pre-wrap">
          {preview}
        </pre>
      </div>
      <LineShareActions text={preview} compact />
      <Button className="w-full" disabled={save.isPending || !title.trim()} onClick={() => save.mutate()}>
        {save.isPending ? "กำลังบันทึก..." : "บันทึกรายงาน"}
      </Button>
    </div>
  );
}
