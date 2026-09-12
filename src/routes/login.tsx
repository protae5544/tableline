import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LineTohMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-line text-on-line">
        <div className="size-12 animate-pulse rounded-2xl bg-on-line/20" />
      </main>
    );
  }

  if (user) {
    void navigate({ to: "/" });
    return null;
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "สมาชิก",
        });
        if (error) throw new Error(error.message ?? "สมัครไม่สำเร็จ");
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (error) throw new Error(error.message ?? "เข้าสู่ระบบไม่สำเร็จ");
      }
      toast.success("เข้าสู่ระบบแล้ว");
      window.location.href = "/";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-line text-on-line">
      <div
        className="flex flex-col items-center px-6 pt-10 pb-8"
        style={{ paddingTop: "max(2.5rem, env(safe-area-inset-top))" }}
      >
        <LineTohMark className="size-16" inverse />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">ไลน์โต๊ะ</h1>
        <p className="mt-2 max-w-xs text-center text-sm text-on-line/85">
          ห้องงานสำหรับสองคน ที่ส่งเข้าไลน์ได้ทันที
          สำหรับเจ้านายที่ไม่รับแอปอื่น
        </p>
      </div>
      <section className="min-h-[55dvh] rounded-t-[28px] bg-surface px-5 py-6 text-ink">
        <h2 className="text-lg font-semibold">เข้าสู่ระบบ</h2>
        <p className="mt-1 text-sm text-muted">ใช้สิทธิ์ล็อกอินเพื่อเข้าห้องส่วนตัวของคุณกับเพื่อน</p>

        {authEnabled ? (
          <div className="mt-5 space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              >
                เข้าด้วย {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">ระบบเข้าสู่ระบบยังไม่เปิด</p>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-subtle">
          <span className="h-px flex-1 bg-border" />
          หรือใช้อีเมล
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
          {mode === "up" ? (
            <div>
              <Label htmlFor="name">ชื่อ</Label>
              <Input
                id="name"
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อในไลน์โต๊ะ"
              />
            </div>
          ) : null}
          <div>
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              className="mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={busy || !authEnabled}>
            {busy ? "กำลังเข้า..." : mode === "up" ? "สมัครแล้วเข้าห้อง" : "เข้าสู่ระบบด้วยอีเมล"}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-line-dark"
          onClick={() => setMode(mode === "up" ? "in" : "up")}
        >
          {mode === "up" ? "มีบัญชีแล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครด้วยอีเมล"}
        </button>
      </section>
    </main>
  );
}
