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

const formSchema = z.object({
	poolName: z.string().min(1, {
		message: "Pool Name is required.",
	}),
	entryFee: z.number().min(1, {
		message: "Entry Fee must be at least 1.",
	}),
});

export default function TestPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			poolName: "",
			entryFee: 100,
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
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
									Enter the name of the pool.
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
									Entry Fee:
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
									Enter the entry fee for the pool.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Create</Button>
				</form>
			</Form>
		</div>
	);
}
