import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChatView } from "@/components/chat-view";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap } from "@/lib/server/api";

export const Route = createFileRoute("/_app/")({ component: Home });

function Home() {
  const bootQ = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  if (!bootQ.data?.workspace) {
    return (
      <div className="p-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return <ChatView bootstrap={bootQ.data} />;
}
const ngrok = require("@ngrok/ngrok");

async function forwardToApp() {
  const forwarder = await ngrok.forward({
    addr: "localhost:8085",
    authtoken_from_env: true,
    domain: "vulture-climbing-solely.ngrok-free.app",
  });
  console.log(`Available at: ${forwarder.url()}`);
}

forwardToApp();
