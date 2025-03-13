"use client";
import slugify from "react-slugify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Game } from "@/lib/services/games";
import { insertPoolSchema } from "@/lib/db/schema/pools";
import { Slider } from "@/components/ui/slider";
import { useServerAction } from "zsa-react";
import { createPoolAction } from "@/lib/actions/pools";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { clarityCode } from "@/lib/pool-clarity-code";
import { openContractDeploy } from "@stacks/connect";
import { userSession } from "@/context/WalletContext";

// Extend the schema to make description required and handle the decimal type for amount
const formSchema = insertPoolSchema.extend({
  description: z.string().min(1, "Description is required"),
});

export default function CreatePoolForm({ games }: { games: Game[] }) {
  const router = useRouter();
  const { user } = useUser();
  const { isPending, execute } = useServerAction(createPoolAction, {
    onSuccess(result) {
      if (result.data.success) {
        const data = result.data.data;
        toast("Pool created successfully!", {
          description:
            "Your pool has been created and is now open for players to join.",
        });
        router.push(`/pools/${data.id}`);
      }
    },
    onError(error) {
      console.error("Server action error:", error);
      toast("Failed to create pool", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: games.length > 0 ? games[0].id : "",
      maxPlayers: 4,
      status: "deploying",
      startTime: new Date(),
      description: "",
      amount: undefined,
      name: "",
      txID: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form submitted with values:", values);

      // Make sure all required fields are present
      if (!user?.id) {
        toast("User not authenticated", {
          description: "You must be logged in to create a pool",
        });
        return;
      }
      await openContractDeploy({
        network: "mainnet",
        userSession: userSession,
        contractName: slugify(values.name) + "-stacks-wars",
        codeBody: clarityCode,
        onFinish: async (response) => {
          if (!response.txId) {
            console.log(response);
            throw new Error("Error deploying contract");
          }

          await execute({
            ...values,
            creatorId: user.id,
            txID: response.txId,
          });
        },
        onCancel: () => {
          toast("Failed to create pool", {
            description: "User cancelled transaction",
          });
        },
      });
    } catch (error) {
      console.error("Error creating pool:", error);
      toast("Failed to create pool", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Pool</CardTitle>
        <CardDescription>
          Set up a new pool for players to join and compete for STX rewards
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pool name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your pool a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Amount (STX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount in STX"
                      {...field}
                      // onChange={(e) => {
                      //   const value =
                      //     e.target.value === ""
                      //       ? undefined
                      //       : Number.parseFloat(e.target.value);
                      //   field.onChange(value);
                      // }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the initial amount you'll contribute to the pool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Players: {field.value}</FormLabel>
                  <FormControl>
                    <div className="pt-2">
                      <Slider
                        min={2}
                        max={12}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(values) => {
                          field.onChange(values[0]);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Select the maximum number of players (2-12) that can join
                    this pool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={games.length > 0 ? games[0].id : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {games.map((game) => (
                        <SelectItem value={game.id} key={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which game will be played in this pool
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
                    <Input placeholder="Enter pool description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide additional details about your pool
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input
              type="hidden"
              {...form.register("startTime")}
              value={new Date().toISOString()}
            />

            <input
              type="hidden"
              {...form.register("status")}
              value="deploying"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/pools">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader className="h-4 w-4 mr-1 animate-spin" size={17} />
              )}
              {isPending ? "Creating..." : "Create Pool"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
