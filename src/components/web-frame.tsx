import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function WebFrame({ url }: { url: string }) {
  const href = useMemo(() => normalizeUrl(url), [url]);
  const [blocked, setBlocked] = useState(false);

  if (!href) {
    return (
      <div className="rounded-2xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-lift">
        วางลิงก์เว็บที่ขึ้นต้นด้วย https
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-lift">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="truncate text-xs text-muted">{href}</p>
        <Button asChild size="sm" variant="outline">
          <a href={href} target="_blank" rel="noreferrer">
            <ExternalLink />
            เปิดแท็บใหม่
          </a>
        </Button>
      </div>
      {blocked ? (
        <div className="px-4 py-10 text-center text-sm text-muted">
          เว็บนี้ไม่อนุญาตให้ฝังในแอป กดเปิดแท็บใหม่แทน
        </div>
      ) : (
        <iframe
          title="เว็บที่เปิด"
          src={href}
          className="h-[62vh] w-full bg-surface"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          onError={() => setBlocked(true)}
        />
      )}
    </div>
  );
}
