import { Check, Copy, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText, openLineShare } from "@/lib/line";
import { cn } from "@/lib/utils";

export function LineShareActions({
  text,
  compact = false,
  className,
}: {
  text: string;
  compact?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast.success("คัดลอกแล้ว วางในไลน์ได้เลย");
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("คัดลอกไม่สำเร็จ");
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        type="button"
        size={compact ? "sm" : "default"}
        className="flex-1"
        onClick={() => openLineShare(text)}
      >
        <Send />
        ส่งเข้าไลน์
      </Button>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        className="flex-1"
        onClick={() => void onCopy()}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ"}
      </Button>
    </div>
  );
}
