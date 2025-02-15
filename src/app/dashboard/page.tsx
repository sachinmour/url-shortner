import { HydrateClient } from "~/trpc/server";
import { UrlListClient } from "./_components/UrlListClient";

export default function DashboardPage() {
  return (
    <HydrateClient>
      <UrlListClient />
    </HydrateClient>
  );
}
