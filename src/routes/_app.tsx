import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Onboarding } from "@/components/onboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getBootstrap } from "@/lib/server/api";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const bootQ = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => getBootstrap(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-line">
        <div className="h-14 bg-line" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (bootQ.isError) {
    const message =
      bootQ.error instanceof Error ? bootQ.error.message : "โหลดไม่สำเร็จ";
    if (message === "Unauthorized") return <RedirectToSignIn />;
    return (
      <AppShell workspace={null}>
        <div className="px-5 py-10 text-center">
          <p className="font-medium">โหลดห้องไม่สำเร็จ</p>
          <p className="mt-1 text-sm text-muted">{message}</p>
          <button
            type="button"
            className="mt-4 text-sm font-medium text-line-dark"
            onClick={() => void bootQ.refetch()}
          >
            ลองใหม่
          </button>
        </div>
      </AppShell>
    );
  }

  const bootstrap = bootQ.data;
  if (bootQ.isPending || !bootstrap) {
    return (
      <AppShell workspace={null}>
        <div className="space-y-3 p-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!bootstrap.workspace) {
    return (
      <AppShell workspace={null}>
        <Onboarding me={bootstrap.me} />
      </AppShell>
    );
  }

  return (
    <AppShell workspace={bootstrap.workspace}>
      <Outlet />
    </AppShell>
  );
}
