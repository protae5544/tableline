import { createFileRoute } from "@tanstack/react-router";
import { WebBrowser } from "@/components/web-browser";

type WebSearch = { url?: string };

export const Route = createFileRoute("/_app/web")({
  component: WebPage,
  validateSearch: (search: Record<string, unknown>): WebSearch => ({
    url: typeof search.url === "string" ? search.url : undefined,
  }),
});

function WebPage() {
  const { url } = Route.useSearch();
  return <WebBrowser initialUrl={url ?? ""} />;
}
