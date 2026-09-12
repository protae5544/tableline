import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UserButton } from "@/lib/auth/gates";
import { LineShareActions } from "@/components/line-share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteLineText } from "@/lib/line";
import { renameMe } from "@/lib/server/api";
import type { Bootstrap } from "@/lib/types";

export function SettingsPanel({ bootstrap }: { bootstrap: Bootstrap }) {
  const qc = useQueryClient();
  const [name, setName] = useState(bootstrap.me.name);
  const rename = useMutation({
    mutationFn: () => renameMe({ data: { name: name.trim() } }),
    onSuccess: async () => {
      toast.success("บันทึกชื่อแล้ว");
      await qc.invalidateQueries({ queryKey: ["bootstrap"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const ws = bootstrap.workspace;

  return (
    <div className="space-y-4 rounded-2xl bg-surface p-4 shadow-lift">
      <div>
        <p className="text-sm font-medium">บัญชี</p>
        <p className="text-xs text-muted">{bootstrap.me.email ?? "ล็อกอินแล้ว"}</p>
      </div>
      <div>
        <Label htmlFor="me-name">ชื่อในห้อง</Label>
        <div className="mt-1.5 flex gap-2">
          <Input id="me-name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button variant="outline" disabled={rename.isPending} onClick={() => rename.mutate()}>
            บันทึก
          </Button>
        </div>
      </div>
      {ws ? (
        <div>
          <p className="text-sm font-medium">รหัสเชิญ</p>
          <p className="mt-1 font-mono text-xl tracking-[0.28em]">{ws.inviteCode}</p>
          <LineShareActions
            className="mt-3"
            compact
            text={inviteLineText(ws.name, ws.inviteCode)}
          />
        </div>
      ) : null}
      <div className="rounded-xl bg-page p-3">
        <UserButton />
      </div>
    </div>
  );
}
