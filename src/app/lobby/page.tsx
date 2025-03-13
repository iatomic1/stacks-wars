import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Users } from "lucide-react";
//import { getAllPools } from "@/lib/services/pools";
import { truncateAddress } from "@/lib/utils";

export default async function PoolsPage() {
	//const pools = await getAllPools();
	//console.log(pools);

	const pools = [
		{
			id: 1,
			name: "Tic Tac Toe",
			status: "full",
			amount: 100,
			maxPlayers: 2,
			participants: [
				{
					id: 1,
					stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
				},
			],
			creator: {
				id: 1,
				stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
			},
			game: { id: 1, name: "Tic Tac Toe" },
		},
		{
			id: 1,
			name: "Tic Tac Toe",
			status: "open",
			amount: 100,
			maxPlayers: 2,
			participants: [
				{
					id: 1,
					stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
				},
			],
			creator: {
				id: 1,
				stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
			},
			game: { id: 1, name: "Tic Tac Toe" },
		},
		{
			id: 1,
			name: "Tic Tac Toe",
			status: "open",
			amount: 100,
			maxPlayers: 2,
			participants: [
				{
					id: 1,
					stxAddress:
						"ST1PQHQKSP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00BV0Z1",
				},
			],
			creator: {
				id: 1,
				stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
			},
			game: { id: 1, name: "Tic Tac Toe" },
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
							<div>
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									{pools.length > 0
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

						<div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
							{pools.map((pool) => (
								<Card key={pool.id} className="overflow-hidden">
									<CardHeader className="pb-3">
										<div className="flex justify-between items-start">
											<CardTitle>{pool.name}</CardTitle>
											<Badge
												variant={
													pool.status === "open"
														? "default"
														: "secondary"
												}
											>
												{pool.status === "open"
													? "Open"
													: "Full"}
											</Badge>
										</div>
										<CardDescription>
											Created by{" "}
											{truncateAddress(
												pool.creator.stxAddress
											)}
										</CardDescription>
									</CardHeader>
									<CardContent className="pb-3">
										<div className="grid gap-2">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Stakes:
												</span>
												<span className="font-medium">
													{pool.amount} STX
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Game:
												</span>
												<span className="font-medium">
													{pool.game.name}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-muted-foreground">
													Players:
												</span>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4 text-muted-foreground" />
													<span className="font-medium">
														{
															pool.participants
																.length
														}
														/{pool.maxPlayers}
													</span>
												</div>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button
											asChild
											variant={
												pool.status === "open"
													? "default"
													: "outline"
											}
											className="w-full gap-1.5 cursor cursor-not-allowed"
											disabled={pool.status !== "open"}
										>
											<Link
												href={`${
													pool.status === "open"
														? `/lobby/${pool.id}`
														: ""
												}`}
												className={`w-full ${
													pool.status === "open"
														? "cursor-pointer"
														: "cursor-not-allowed"
												}`}
											>
												{pool.status === "open"
													? "Join Pool"
													: "Pool Full"}
												{pool.status === "open" && (
													<ArrowRight className="h-4 w-4" />
												)}
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
