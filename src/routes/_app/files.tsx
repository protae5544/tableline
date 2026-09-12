import { createFileRoute } from "@tanstack/react-router";
import { FileDrawer } from "@/components/file-drawer";

export const Route = createFileRoute("/_app/files")({ component: FilesPage });

function FilesPage() {
  return <FileDrawer />;
}
