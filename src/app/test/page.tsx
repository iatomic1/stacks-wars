"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClarityCode } from "@/lib/pool-clarity-code";
import { request } from "@stacks/connect";
//import { createGamePool } from "@/lib/wallet/createGamePool";
import { generateWinnerSignature } from "@/lib/wallet/wallet";
import { useUser } from "@/context/UserContext";

const formSchema = z.object({
	poolName: z.string().min(1, {
		message: "Pool Name is required.",
	}),
	entryFee: z
		.string()
		.min(1, {
			message: "Entry Fee is required.",
		})
		.transform((val) => parseFloat(val))
		.refine((val) => !isNaN(val) && val >= 1, {
			message: "Entry Fee must be at least 1.",
		}),
});

export default function TestPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const { user } = useUser();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const signature = generateWinnerSignature(100, user?.stxAddress ?? "");
		console.log("Signature", signature);
		const clarityCode = getClarityCode(100, user?.stxAddress ?? "");
		const response = await request("stx_deployContract", {
			name: "stacks-wars-ts",
			clarityCode,
			network: "testnet",
		});
		console.log(response);
	};

	return (
		<div className="min-h-screen max-w-md mx-auto p-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="poolName"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="poolName">
									Pool Name:
								</FormLabel>
								<FormControl>
									<Input
										id="poolName"
										placeholder="Enter Pool Name"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter of the pool id.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="entryFee"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="entryFee">
									Enter Claim amount
								</FormLabel>
								<FormControl>
									<Input
										id="entryFee"
										type="number"
										placeholder="Enter Entry Fee"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter the amount to claim.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Generate Signature</Button>
				</form>
			</Form>
		</div>
	);
}
