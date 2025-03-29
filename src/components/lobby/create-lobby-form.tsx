"use client";
//import slugify from "react-slugify";
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
import { Slider } from "@/components/ui/slider";
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
import { createLobbyAction } from "@/lib/actions/lobby";
import { useUser } from "@/context/UserContext";
//import { openContractDeploy } from "@stacks/connect";
//import { userSession } from "@/context/WalletContext";
//import { getClarityCode } from "@/lib/pool-clarity-code";
import { useCreateLobbyWithPool } from "@/hooks/useCreateLobbyWithPool";
import { createLobbyWithPool } from "@/lib/lobbyWithPool";
import { useRouter } from "next/navigation";
//interface CreateLobbyFormProps {
//	games: Game[];
//	isLoading?: boolean;
//}

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
	players: z
		.number()
		.min(2, {
			message: "At least 2 players are required.",
		})
		.max(10, {
			message: "Maximum 10 players allowed.",
		}),
});

export default function CreateLobbyForm({ gameId }: { gameId: string }) {
	const { user } = useUser();

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			withPool: false,
			amount: 100,
			players: 10,
		},
	});

	const withPool = form.watch("withPool");

	const { isPending, execute: executeCreateLobby } = useServerAction(
		createLobbyAction,
		{
			onSuccess(args) {
				const data = args.data.data;
				if (data && data.id !== "") {
					toast.success("Lobby created successfully");
					router.push(`/lobby/${data.id}`);
				}
			},
		}
	);

	const { isPending: isLoading, execute: executeCreateLobbyWithPool } =
		useCreateLobbyWithPool();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!user?.id) {
			toast.info("User not authenticated", {
				description: "You must be logged in to create a Lobby",
			});

			return;
		}
		if (values.withPool) {
			createLobbyWithPool(values, executeCreateLobbyWithPool, user);
		} else {
			await executeCreateLobby({
				name: values.name,
				description: values.description,
				gameId: gameId,
				maxPlayers: values.players,
				creatorId: user.id,
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
							name="players"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Players</FormLabel>
									<div className="space-y-2">
										<FormControl>
											<Slider
												min={2}
												max={10}
												step={1}
												value={[field.value]}
												onValueChange={(value) =>
													field.onChange(value[0])
												}
											/>
										</FormControl>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">
												2
											</span>
											<span className="font-medium">
												{field.value} players
											</span>
											<span className="text-sm text-muted-foreground">
												10
											</span>
										</div>
									</div>
									<FormDescription>
										Set the maximum number of players for
										your lobby
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
