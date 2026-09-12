import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LineTohMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspace, joinWorkspace, renameMe } from "@/lib/server/api";
import type { Profile } from "@/lib/types";

export function Onboarding({ me }: { me: Profile }) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("ห้องงานของเรา");
  const [displayName, setDisplayName] = useState(me.name === "สมาชิก" ? "" : me.name);
  const [code, setCode] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      const trimmed = displayName.trim();
      if (trimmed && trimmed !== me.name) await renameMe({ data: { name: trimmed } });
      return createWorkspace({ data: { name: name.trim() || "ห้องงานของเรา" } });
    },
    onSuccess: async () => {
      toast.success("สร้างห้องแล้ว");
      await qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const join = useMutation({
    mutationFn: async () => {
      const trimmed = displayName.trim();
      if (trimmed && trimmed !== me.name) await renameMe({ data: { name: trimmed } });
      return joinWorkspace({ data: { code } });
    },
    onSuccess: async () => {
      toast.success("เข้าห้องแล้ว");
      await qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-md flex-col justify-center px-5 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-line">
          <LineTohMark className="size-11" />
        </span>
        <div>
          <p className="text-xs font-medium tracking-wide text-line-dark">ไลน์โต๊ะ</p>
          <h1 className="text-2xl font-semibold tracking-tight">ห้องงานสำหรับสองคน</h1>
        </div>
      </div>
      <p className="mb-6 text-sm text-muted">
        ออกแบบมาให้คุย เก็บไฟล์ วาดบอร์ด และส่งรายงานเข้าไลน์ได้ทันที
        สำหรับเจ้านายที่ทำงานในไลน์อย่างเดียว
      </p>

      <div className="mb-4">
        <Label htmlFor="display-name">ชื่อที่คู่หูและเจ้านายเห็น</Label>
        <Input
          id="display-name"
          className="mt-1.5"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="ชื่อเล่นในไลน์"
        />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-page p-1.5">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium ${
            mode === "create" ? "bg-surface text-ink shadow-lift" : "text-muted"
          }`}
        >
          <Plus className="size-4" />
          สร้างห้อง
        </button>
        <button
          type="button"
          onClick={() => setMode("join")}
          className={`flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium ${
            mode === "join" ? "bg-surface text-ink shadow-lift" : "text-muted"
          }`}
        >
          <KeyRound className="size-4" />
          มีรหัสแล้ว
        </button>
      </div>

      {mode === "create" ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="room-name">ชื่อห้อง</Label>
            <Input
              id="room-name"
              className="mt-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ห้องงานของเรา"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={create.isPending}
            onClick={() => create.mutate()}
          >
            {create.isPending ? "กำลังสร้าง..." : "สร้างห้องแล้วชวนเพื่อนในไลน์"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="invite-code">รหัส 6 ตัวจากเพื่อน</Label>
            <Input
              id="invite-code"
              className="mt-1.5 text-center font-semibold tracking-[0.35em] uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={8}
              autoCapitalize="characters"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={join.isPending || code.trim().length < 4}
            onClick={() => join.mutate()}
          >
            {join.isPending ? "กำลังเข้าห้อง..." : "เข้าห้อง"}
          </Button>
        </div>
      )}
    </div>
  );
}
