import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Whiteboard } from "@/components/whiteboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap } from "@/lib/server/api";

export const Route = createFileRoute("/_app/board")({ component: BoardPage });

function BoardPage() {
  const bootQ = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  if (!bootQ.data?.me) {
    return (
      <div className="p-4">
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }
  return <Whiteboard userId={bootQ.data.me.id} />;
}
