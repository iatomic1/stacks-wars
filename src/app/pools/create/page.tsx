import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllGames } from "@/lib/services/games";
import CreatePoolForm from "./_components/create-pool-form";

export default async function CreatePoolPage() {
  const games = await getAllGames();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container max-w-3xl py-12">
          <Link
            href="/pools"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>
          <CreatePoolForm games={games} />
        </div>
      </main>
    </div>
  );
}
