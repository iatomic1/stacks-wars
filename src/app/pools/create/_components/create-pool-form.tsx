"use client";
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
import { Game } from "@/lib/services/games";
import { insertPoolSchema } from "@/lib/db/schema/pools";
import { Slider } from "@/components/ui/slider";
import { useServerAction } from "zsa-react";
import { createPoolAction } from "@/lib/actions/pools";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useUser } from "@/context/UserContext";

const formSchema = insertPoolSchema;

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
  });

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      // creatorId: "",
      gameId: games.length > 0 ? games[0].id : "",
      // amount: "",
      maxPlayers: 4,
      status: "open",
      // stxAddress: "",
      // description: "",
      startTime: new Date(),
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form submitted with values:", values);
      await execute({
        creatorId: user?.id,
        ...values,
      });
    } catch (error) {
      console.error("Error creating pool:", error);
      // toast({
      //   title: "Failed to create pool",
      //   description:
      //     error instanceof Error
      //       ? error.message
      //       : "An unexpected error occurred",
      //   variant: "destructive",
      // });
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

            {/* Hidden field for status */}
            <input type="hidden" {...form.register("status")} value="open" />
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
