import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

export default function FeaturedGame() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Featured Games
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Compete in these exciting games to win STX rewards
						</p>
					</div>
				</div>
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
					<div className="group relative overflow-hidden rounded-lg border">
						<Image
							src="/placeholder.svg?height=300&width=400"
							width={400}
							height={300}
							alt="Car Arcade"
							className="aspect-video object-cover transition-transform group-hover:scale-105"
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
							<h3 className="text-xl font-bold text-white">
								Car Arcade
							</h3>
							<p className="text-white/80">
								Race to the finish line
							</p>
							<Button
								variant="secondary"
								size="sm"
								className="mt-4"
							>
								Play Now
							</Button>
						</div>
					</div>
					<div className="group relative overflow-hidden rounded-lg border">
						<Image
							src="/placeholder.svg?height=300&width=400"
							width={400}
							height={300}
							alt="WRG"
							className="aspect-video object-cover transition-transform group-hover:scale-105"
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
							<h3 className="text-xl font-bold text-white">
								WRG
							</h3>
							<p className="text-white/80">Strategic gameplay</p>
							<Button
								variant="secondary"
								size="sm"
								className="mt-4"
							>
								Play Now
							</Button>
						</div>
					</div>
					<div className="group relative overflow-hidden rounded-lg border">
						<Image
							src="/placeholder.svg?height=300&width=400"
							width={400}
							height={300}
							alt="Kahoot-style"
							className="aspect-video object-cover transition-transform group-hover:scale-105"
						/>
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
							<h3 className="text-xl font-bold text-white">
								Kahoot-style
							</h3>
							<p className="text-white/80">Test your knowledge</p>
							<Button
								variant="secondary"
								size="sm"
								className="mt-4"
							>
								Play Now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
