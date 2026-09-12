import { createFileRoute } from "@tanstack/react-router";
import { DocViewer } from "@/components/doc-viewer";

export const Route = createFileRoute("/_app/files/$docId")({
  component: DocPage,
});

function DocPage() {
  const { docId } = Route.useParams();
  const id = Number(docId);
  if (!Number.isFinite(id)) return <p className="p-6">ลิงก์เอกสารไม่ถูกต้อง</p>;
  return <DocViewer docId={id} />;
}
