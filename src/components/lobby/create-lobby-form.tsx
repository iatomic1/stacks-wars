"use client";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { createLobbyAction, joinLobbyAction } from "@/lib/actions/lobby";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { createGamePool } from "@/lib/actions/create-game-pool";
import { joinGamePool } from "@/lib/actions/join-game-pool";
import { Lobby } from "@/lib/services/lobby";
import { useState } from "react";

const formSchema = z.object({
	name: z.string().min(3, {
		message: "Lobby name must be at least 3 characters.",
	}),
	description: z.string().min(3, {
		message: "Lobby description must be at least 3 characters.",
	}),
	withPool: z.boolean().default(false),
	amount: z.coerce
		.number()
		.min(1, {
			message: "Amount must be at least 1 STX.",
		})
		.optional(),
});

export default function CreateLobbyForm({ gameId }: { gameId: string }) {
	const { user } = useUser();
	const [lobbyData, setLobbyData] = useState<Lobby | null>(null);

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			withPool: false,
			amount: undefined,
		},
	});

	const withPool = form.watch("withPool");

	const { isPending: isLoading, execute: executeJoinLobby } = useServerAction(
		joinLobbyAction,
		{
			onSuccess(args) {
				console.log("Successfully joined the lobby");
				const data = args.data.data;
				if (data) {
					toast.success("Successfully joined the lobby");
					router.replace(`/lobby/${data.lobbyId}`);
				}
			},
			onError(error) {
				console.error("Error joining lobby:", error);
				toast.error("Failed to join lobby", {
					description:
						(error.err as Error).message ||
						"An unknown error occurred",
				});
			},
		}
	);

	const { isPending, execute: executeCreateLobby } = useServerAction(
		createLobbyAction,
		{
			async onSuccess(args) {
				const data = args.data.data;
				if (data && data.id !== "") {
					toast.success("Lobby created successfully");
					setLobbyData(data);
					console.log("lobbyData is alive", lobbyData);
				}
			},
			onError(error) {
				console.error("Error in executeCreateLobby:", error);
				toast.error("Failed to create lobby", {
					description:
						(error.err as Error).message ||
						"An unknown error occurred",
				});
			},
		}
	);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		if (!user?.id) {
			toast.info("User not authenticated", {
				description: "You must be logged in to create a Lobby",
			});

			return;
		}

		if (values.withPool && values.amount) {
			toast.info("Trying to deploy your pool contract...", {
				description: "wait for wallet confirmation",
			});
			const contractName = `${nanoid(5)}-stacks-wars`;
			const contract: `${string}.${string}` = `${user.stxAddress}.${contractName}`;
			const contractDeployResponse = await createGamePool(
				values.amount,
				contractName,
				user.stxAddress
			);
			console.log(contractDeployResponse, contractDeployResponse.txid);
			toast.info("Creating your lobby...");
			await executeCreateLobby({
				lobby: {
					name: values.name,
					description: values.description,
					gameId: gameId,
					creatorId: user.id,
				},
				pool: {
					entryAmount: values.amount?.toString() as string,
					deployContractTxId: contractDeployResponse.txid ?? "",
					lobbyId: gameId,
					contract,
				},
			});
			console.log(lobbyData);
			if (lobbyData) {
				toast.info("Joining your pool...", {
					description: "wait for wallet confirmation",
				});
				const joinPoolResponse = await joinGamePool(
					contract,
					user.stxAddress,
					values.amount
				);
				console.log("joinPoolResponse", joinPoolResponse.txid);
			} else {
				console.log(
					"An unknown error occurred, while joining the pool"
				);
				toast.error("Failed to create lobby", {
					description: "Please try again",
				});
			}
		} else {
			await executeCreateLobby({
				lobby: {
					name: values.name,
					description: values.description,
					gameId: gameId,
					creatorId: user.id,
				},
			});
		}
		toast.info("Please wait while we redirect you to the lobby");
		if (lobbyData) {
			await executeJoinLobby({
				userId: user.id,
				lobbyId: lobbyData.id,
				stxAddress: user.stxAddress,
				username: user.stxAddress,
				amount: values.amount,
			});
		} else {
			toast.error("Something went wrong while joining the lobby", {
				description: "Please try again",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Create a Lobby</CardTitle>
				<CardDescription>
					Set up a new lobby and invite friends to join
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="inline-flex items-center gap-1">
										Lobby Name
										<span className="text-destructive">
											*
										</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter lobby name"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Give your lobby a descriptive name
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter lobby description"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Provide additional details about your
										lobby
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="withPool"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-2 space-y-0">
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={() => {
												field.onChange(!field.value);
											}}
										/>
									</FormControl>
									<FormLabel>
										Create lobby with pool
									</FormLabel>
								</FormItem>
							)}
						/>
						{withPool && (
							<>
								<FormField
									control={form.control}
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="inline-flex items-center gap-1">
												Pool Amount (STX)
												<span className="text-destructive">
													*
												</span>
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter amount in STX"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This is the initial amount
												you&apos;ll contribute to the
												pool and entry fee for other
												players
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline" asChild>
							<Link href="/games">Cancel</Link>
						</Button>
						<Button type="submit" disabled={isPending || isLoading}>
							{(isPending || isLoading) && (
								<Loader
									className="h-4 w-4 mr-1 animate-spin"
									size={17}
								/>
							)}
							{isPending || isLoading
								? "Creating..."
								: "Create Lobby"}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
