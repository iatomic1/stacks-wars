import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Rocket, Trophy, Gamepad, Smartphone, Coins } from "lucide-react";

const phases = [
	{
		id: "phase-1",
		icon: <Rocket className="h-5 w-5" />,
		title: "Foundation & Community Building",
		description:
			"Establishing the groundwork and early community engagement",
		status: "In Progress",
		milestones: [
			{
				title: "Community Ecosystem Launch",
				description:
					"Establishing presence on Twitter, Discord, and Telegram with regular development updates and community engagement",
			},
			{
				title: "Platform Preview Release",
				description:
					"First public showcase of Stacks Wars v1.0 interface and core features",
			},
			{
				title: "Early Access Program",
				description:
					"Limited beta tester registration opens for community members",
			},
			{
				title: "Lexi War Alpha Release",
				description:
					"Launch of our flagship word-rule game as a preview of platform capabilities",
				highlight: true,
			},
		],
	},
	{
		id: "phase-2",
		icon: <Trophy className="h-5 w-5" />,
		title: "Beta Launch & Core Features",
		description:
			"Introducing competitive elements and expanding game offerings",
		status: "Upcoming",
		milestones: [
			{
				title: "Beta Platform Launch",
				description:
					"Opening access to early registrants with Lexi War gameplay",
			},
			{
				title: "Competitive Framework",
				description:
					"Implementation of global leaderboards and experience-based progression system",
			},
			{
				title: "Security Incentives",
				description:
					"Launch of bug bounty program with STX rewards for identified vulnerabilities",
			},
			{
				title: "Game Ecosystem Expansion",
				description:
					"Introduction of sports betting platform and Aviator game",
				highlight: true,
			},
		],
	},
	{
		id: "phase-3",
		icon: <Gamepad className="h-5 w-5" />,
		title: "Platform Maturity & Features",
		description: "Full platform launch with enhanced gaming experiences",
		status: "Planned",
		milestones: [
			{
				title: "Official Platform Launch",
				description:
					"Complete platform deployment with redesigned interface and enhanced user experience",
			},
			{
				title: "Engagement Rewards",
				description:
					"Introduction of point farming system for active platform participation",
			},
			{
				title: "Sports Betting Integration",
				description: "Launch of secure sports betting platform",
			},
			{
				title: "Premium Gaming Features",
				description:
					"Introduction of high-stakes tournaments, jackpots, and customization options",
			},
			{
				title: "Growth Incentives",
				description: "Implementation of referral reward system",
				highlight: true,
			},
		],
	},
	{
		id: "phase-4",
		icon: <Smartphone className="h-5 w-5" />,
		title: "Platform Expansion",
		description: "Extending accessibility and community governance",
		status: "Planned",
		milestones: [
			{
				title: "Gaming Portfolio Expansion",
				description:
					"Regular addition of new casino games and casual gaming options",
			},
			{
				title: "Mobile Platform Launch",
				description:
					"Release of native mobile applications for iOS and Android",
			},
			{
				title: "Community Governance",
				description:
					"Implementation of DAO-based voting system for platform decisions",
				highlight: true,
			},
		],
	},
	{
		id: "phase-5",
		icon: <Coins className="h-5 w-5" />,
		title: "Tokenization & Community Rewards",
		description: "Introduction of platform token and community benefits",
		status: "Planned",
		milestones: [
			{
				title: "Token Launch",
				description:
					"Introduction of Stacks Wars native token with utility features",
			},
			{
				title: "Community Airdrop",
				description:
					"Distribution of tokens to active community members and early adopters",
				highlight: true,
			},
		],
	},
];

export default function Roadmap() {
	return (
		<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Roadmap
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Our journey to revolutionize blockchain gaming
						</p>
					</div>
				</div>

				<div className="mx-auto max-w-3xl space-y-4 py-12">
					<Accordion type="single" collapsible className="space-y-4">
						{phases.map((phase) => (
							<AccordionItem
								key={phase.id}
								value={phase.id}
								className="border rounded-lg bg-card"
							>
								<AccordionTrigger className="px-6 [&>svg]:shrink-0">
									<div className="flex items-center gap-4 text-left">
										<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
											{phase.icon}
										</div>
										<div>
											<h3 className="font-semibold">
												{phase.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{phase.description}
											</p>
										</div>
										<Badge
											variant={
												phase.status === "In Progress"
													? "default"
													: "secondary"
											}
											className="ml-auto"
										>
											{phase.status}
										</Badge>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="px-6 pb-6">
										<div className="space-y-4">
											{phase.milestones.map(
												(milestone, index) => (
													<Card
														key={index}
														className={
															milestone.highlight
																? "border-primary/50 bg-primary/5"
																: ""
														}
													>
														<CardHeader className="pb-2">
															<CardTitle className="text-base">
																{
																	milestone.title
																}
															</CardTitle>
														</CardHeader>
														<CardContent>
															<CardDescription>
																{
																	milestone.description
																}
															</CardDescription>
														</CardContent>
													</Card>
												)
											)}
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
