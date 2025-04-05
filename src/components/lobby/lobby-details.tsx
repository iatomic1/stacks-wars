import React from "react";
import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import { Progress } from "../ui/progress";
import { Info } from "lucide-react";
import { LobbySchema } from "@/types/lobbySchema";

export default function LobbyDetails({ lobby }: { lobby: LobbySchema }) {
	// Calculate participation percentage
	const participationPercentage =
		(lobby.participants.length / lobby.game.maxPlayers) * 100;

	return (
		<Card className="overflow-hidden">
			<CardHeader className="bg-muted/30 p-4 pb-3 sm:p-6 sm:pb-4">
				<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
					<Info className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
					Lobby Details
				</CardTitle>
			</CardHeader>
			<CardContent className="sm:p-6">
				<div className="">
					<div>
						<h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
							Pool Progress
						</h3>
						<div className="space-y-2">
							<div className="flex justify-between text-xs sm:text-sm">
								<span>{lobby.participants.length} joined</span>
								<span>{lobby.game.maxPlayers} max</span>
							</div>
							<Progress
								value={participationPercentage}
								className="h-2"
							/>
						</div>
					</div>

					<>
						{/*<div className="mt-3">
						<h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
							Created by
						</h3>
						<div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
										<User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									</div>
									<div className="overflow-hidden">
										<p className="text-sm sm:text-base font-medium truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-[300px]">
											{
												pool.creator
													.stxAddress
											}
										</p>
									</div>
								</div>
								<div>
									<Button
										variant={"link"}
										asChild
									>
										<a
											href={`${EXPLORER_BASE_URL}txid/${
												deployTx?.tx_status ===
												"success"
													? pool
															.creator
															.stxAddress +
														"." +
														slugify(
															pool.name
														) +
														"-stacks-wars"
													: pool.txID
											}`}
											target="_blank"
										>
											{deployTx?.tx_status ===
											"success"
												? "View Pool Contract"
												: "TX ID"}
										</a>
									</Button>
								</div>
							</div>
						</div>
					</div>*/}
					</>
				</div>
			</CardContent>
		</Card>
	);
}
