import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ActiveLobbies from "@/components/lobby/active-lobbies";
//import { getAvailableLobbies, getLobbies } from "@/lib/services/lobby";
import { getLobbies } from "@/lib/services/lobby";
import { Lobby } from "@/types/schema";
export default async function PoolsPage() {
	//const lobbies = await getAvailableLobbies();
	//console.log(JSON.stringify(lobbies, null, 2));
	const lobbies: Lobby[] = await getLobbies();

	if (!lobbies) {
		return <div>No lobbies found</div>;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
							<div>
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									{lobbies.length > 0
										? "Active Lobbies"
										: "There are no active lobbies"}
								</h1>
								<p className="mt-2 text-muted-foreground">
									Join a lobby to Bettle
								</p>
							</div>
							<Link href="/games">
								<Button className="gap-1.5">
									<Plus className="h-4 w-4" />
									Create A Match
								</Button>
							</Link>
						</div>
						<div className="mt-6 p-4 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-lg">
							<p className="text-yellow-500 text-sm font-medium flex items-center gap-2">
								🚧 This feature is currently under development.
								Check back soon for updates!
							</p>
						</div>
						<div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
							<ActiveLobbies lobbies={lobbies} />
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
