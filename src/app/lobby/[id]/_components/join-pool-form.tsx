"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

interface JoinPoolFormProps {
	amount: number;
	maxPlayers: number;
	currentPlayers: number;
	isUserJoined: boolean;
	isUserConnected: boolean;
	isLoading?: boolean;
	onSubmit: () => void;
}

export default function JoinPoolForm({
	amount,
	maxPlayers,
	currentPlayers,
	isUserJoined,
	isUserConnected,
	isLoading = false,
	onSubmit,
}: JoinPoolFormProps) {
	const entryFee = amount / maxPlayers;

	const getButtonState = () => {
		if (isLoading) {
			return (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Joining...
				</>
			);
		}

		if (!isUserConnected) {
			return (
				<>
					<Lock className="mr-2 h-4 w-4" />
					Connect Wallet to Join
				</>
			);
		}

		if (isUserJoined) {
			return "Already Joined";
		}

		if (currentPlayers >= maxPlayers) {
			return "Pool Full";
		}

		return "Join Pool";
	};

	const isButtonDisabled =
		isLoading ||
		!isUserConnected ||
		isUserJoined ||
		currentPlayers >= maxPlayers;

	return (
		<Card className="overflow-hidden border-primary/20 !pt-0">
			<CardHeader className="bg-primary/5 p-4 pb-3 sm:pb-4">
				<CardTitle className="text-base sm:text-lg">
					Join This Pool
				</CardTitle>
				<CardDescription className="text-xs sm:text-sm">
					Entry fee: {entryFee.toFixed(2)} STX
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit();
					}}
				>
					<div className="space-y-2">
						<Label htmlFor="stx-amount">STX Amount</Label>
						<Input
							id="stx-amount"
							type="number"
							placeholder="Enter amount in STX"
							value={entryFee}
							disabled
							required
						/>
						<p className="text-xs text-muted-foreground">
							Prize Pool / Players
						</p>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isButtonDisabled}
					>
						{getButtonState()}
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col space-y-2">
				<p className="text-sm text-gray-500">
					By joining, you agree to the pool rules and terms.
				</p>
				<Link
					href="/about/pools"
					className="text-sm text-blue-500 hover:underline"
				>
					Learn how pools work
				</Link>
			</CardFooter>
		</Card>
	);
}
