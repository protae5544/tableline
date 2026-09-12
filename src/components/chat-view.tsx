import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LineShareActions } from "@/components/line-share";
import { SettingsPanel } from "@/components/settings-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { relativeThai } from "@/lib/format";
import {
  dailyDigestLineText,
  inviteLineText,
  QUICK_PHRASES,
} from "@/lib/line";
import { getDashboard, listMessages, sendMessage } from "@/lib/server/api";
import type { Bootstrap, ChatMessage, Dashboard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatView({ bootstrap }: { bootstrap: Bootstrap }) {
  const ws = bootstrap.workspace!;
  const me = bootstrap.me;
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const messagesQ = useQuery({
    queryKey: ["messages"],
    queryFn: () => listMessages(),
    refetchInterval: 2500,
  });
  const dashQ = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
    refetchInterval: 8000,
  });

  const send = useMutation({
    mutationFn: (body: string) => sendMessage({ data: { body, kind: "text" } }),
    onSuccess: async () => {
      setDraft("");
      await qc.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const messages = messagesQ.data ?? [];
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const digest = useMemo(() => {
    const dash: Dashboard | undefined = dashQ.data;
    return dailyDigestLineText({
      workspaceName: ws.name,
      authorName: me.name,
      files: dash?.files ?? 0,
      messages: dash?.messages ?? 0,
      reports: dash?.reports ?? 0,
      partnerName: ws.partner?.name ?? null,
    });
  }, [dashQ.data, me.name, ws.name, ws.partner?.name]);

  function submit() {
    const body = draft.trim();
    if (!body) return;
    send.mutate(body);
  }

  return (
    <div className="flex h-full min-h-[calc(100dvh-7.5rem)] flex-col">
      <div className="space-y-3 bg-page px-4 py-3">
        <InviteCard
          workspaceName={ws.name}
          code={ws.inviteCode}
          waiting={!ws.partner}
          partnerName={ws.partner?.name ?? null}
        />
        {dashQ.data ? <DashStrip dash={dashQ.data} /> : <Skeleton className="h-20 w-full" />}
        <LineShareActions text={digest} compact />
        <details className="rounded-2xl bg-surface p-1 shadow-lift">
          <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium">
            บัญชี รหัสเชิญ และออกจากระบบ
          </summary>
          <div className="px-1 pb-2">
            <SettingsPanel bootstrap={bootstrap} />
          </div>
        </details>
      </div>

      <div
        ref={scroller}
        className="chat-wallpaper min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3"
      >
        {messagesQ.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="ml-auto h-12 w-1/2" />
          </div>
        ) : (
          messages.map((m) => (
            <Bubble key={m.id} msg={m} mine={m.userId === me.id} />
          ))
        )}
      </div>

      <div className="border-t border-border bg-surface px-3 pt-2">
        <div className="-mx-1 mb-2 flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_PHRASES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => send.mutate(p)}
              className="h-9 shrink-0 rounded-full bg-mint px-3 text-xs font-medium text-line-dark"
            >
              {p}
            </button>
          ))}
        </div>
        <form
          className="flex items-end gap-2 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="พิมพ์ข้อความ แล้วส่งเข้าไลน์ได้"
            className="max-h-28 min-h-11 flex-1 resize-none rounded-[22px] border border-border bg-page px-4 py-2.5 text-base outline-none focus-visible:border-line"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={send.isPending || !draft.trim()}
            aria-label="ส่ง"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function InviteCard({
  workspaceName,
  code,
  waiting,
  partnerName,
}: {
  workspaceName: string;
  code: string;
  waiting: boolean;
  partnerName: string | null;
}) {
  const text = inviteLineText(workspaceName, code);
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-lift">
      <p className="text-xs font-medium text-line-dark">
        {waiting ? "ชวนคู่หูเข้าห้องผ่านไลน์" : `ห้องนี้มี ${partnerName} แล้ว`}
      </p>
      <p className="mt-1 font-mono text-2xl tracking-[0.28em]">{code}</p>
      <p className="mt-1 text-xs text-muted">
        ห้องรับได้แค่ 2 คน ส่งรหัสนี้ในไลน์ให้เพื่อน
      </p>
      <LineShareActions text={text} compact className="mt-3" />
    </div>
  );
}

function DashStrip({ dash }: { dash: Dashboard }) {
  const cells = [
    { label: "ไฟล์", value: dash.files },
    { label: "ข้อความ", value: dash.messages },
    { label: "รายงาน", value: dash.reports },
    { label: "เสร็จสัปดาห์นี้", value: dash.doneThisWeek },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div key={c.label} className="rounded-xl bg-surface px-2 py-2.5 text-center shadow-lift">
          <p className="font-semibold tabular-nums text-ink">{c.value}</p>
          <p className="text-[10px] text-muted">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function Bubble({ msg, mine }: { msg: ChatMessage; mine: boolean }) {
  if (msg.kind === "system") {
    return (
      <p className="px-6 py-1 text-center text-[11px] text-ink/70">{msg.body}</p>
    );
  }
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-3 py-2 text-[15px] leading-snug shadow-sm",
          mine
            ? "bubble-me bg-line text-on-line"
            : "bubble-you bg-surface text-ink",
        )}
      >
        {!mine ? (
          <p className="mb-0.5 text-[11px] font-medium text-line-dark">{msg.authorName}</p>
        ) : null}
        <p className="whitespace-pre-wrap">{msg.body}</p>
        <p className={cn("mt-1 text-[10px]", mine ? "text-on-line/75" : "text-subtle")}>
          {relativeThai(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}
