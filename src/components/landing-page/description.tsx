import { Trophy, Users, Gamepad2 } from "lucide-react";

export default function Description() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							How the War is Fought
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Battle it out for glory and rewards in three simple
							steps.
						</p>
					</div>
				</div>
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
					<div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Users className="h-8 w-8 text-primary" />
						</div>
						<h3 className="text-xl font-bold">Enter the Lobby</h3>
						<p className="text-center text-muted-foreground">
							Create or join a game lobby, lock in your STX, and
							get ready for battle.
						</p>
					</div>
					<div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Gamepad2 className="h-8 w-8 text-primary" />
						</div>
						<h3 className="text-xl font-bold">Fight to the Top</h3>
						<p className="text-center text-muted-foreground">
							Engage in intense gameplay and battle other warriors
							for dominance.
						</p>
					</div>
					<div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Trophy className="h-8 w-8 text-primary" />
						</div>
						<h3 className="text-xl font-bold">Claim Your Spoils</h3>
						<p className="text-center text-muted-foreground">
							Win STX and rise in the ranks. The top warriors take
							home the prize.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
