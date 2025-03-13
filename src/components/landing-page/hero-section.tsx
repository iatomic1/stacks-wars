import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
			<div className="container px-4 md:px-6">
				<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
								Enter the Lobby. Compete. Conquer.
							</h1>
							<p className="max-w-[600px] text-muted-foreground md:text-xl">
								Dive into high-stakes battles, outplay rivals,
								and claim Stacks (STX) as your reward. The
								warzone awaits!
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row">
							<Link href="/games">
								<Button size="lg" className="gap-1.5">
									Create a Match
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
							<Link href="/lobby">
								<Button size="lg" variant="outline">
									Join the Battle
								</Button>
							</Link>
						</div>
					</div>
					<Image
						src="/placeholder.svg?height=550&width=550"
						width={550}
						height={550}
						alt="Stacks Wars Lobby"
						className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
					/>
				</div>
			</div>
		</section>
	);
}
