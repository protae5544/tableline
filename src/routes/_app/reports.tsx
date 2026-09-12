import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReportStudio } from "@/components/report-studio";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap } from "@/lib/server/api";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  const bootQ = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  if (!bootQ.data?.me) {
    return (
      <div className="p-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return <ReportStudio authorName={bootQ.data.me.name} />;
}
