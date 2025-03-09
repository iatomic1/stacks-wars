import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  // This would be fetched from an API in a real application
  const weeklyLeaders = [
    {
      rank: 1,
      name: "alex.btc",
      wins: 5,
      earnings: 2500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 2,
      name: "crypto_gamer",
      wins: 4,
      earnings: 1800,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 3,
      name: "stacks_master",
      wins: 4,
      earnings: 1500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 4,
      name: "player4",
      wins: 3,
      earnings: 1200,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 5,
      name: "player5",
      wins: 3,
      earnings: 1000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 6,
      name: "player6",
      wins: 2,
      earnings: 800,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 7,
      name: "player7",
      wins: 2,
      earnings: 700,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 8,
      name: "player8",
      wins: 2,
      earnings: 600,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 9,
      name: "player9",
      wins: 1,
      earnings: 400,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 10,
      name: "player10",
      wins: 1,
      earnings: 300,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const allTimeLeaders = [
    {
      rank: 1,
      name: "stacks_master",
      wins: 42,
      earnings: 25000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 2,
      name: "crypto_gamer",
      wins: 38,
      earnings: 21000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 3,
      name: "alex.btc",
      wins: 35,
      earnings: 18500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 4,
      name: "player5",
      wins: 30,
      earnings: 15000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 5,
      name: "player4",
      wins: 28,
      earnings: 14000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 6,
      name: "player7",
      wins: 25,
      earnings: 12500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 7,
      name: "player6",
      wins: 22,
      earnings: 11000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 8,
      name: "player9",
      wins: 20,
      earnings: 10000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 9,
      name: "player8",
      wins: 18,
      earnings: 9000,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 10,
      name: "player10",
      wins: 15,
      earnings: 7500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Leaderboard
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See who's winning the most STX in our games
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl py-12">
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="weekly">Weekly Leaders</TabsTrigger>
                  <TabsTrigger value="all-time">All-Time Leaders</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly">
                  <Card>
                    <CardHeader>
                      <CardTitle>This Week's Top Players</CardTitle>
                      <CardDescription>
                        Rankings based on performance from{" "}
                        {new Date(
                          Date.now() - 7 * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}{" "}
                        to {new Date().toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-4">
                          {weeklyLeaders.slice(0, 3).map((leader) => (
                            <Card
                              key={leader.rank}
                              className={`border-2 ${
                                leader.rank === 1
                                  ? "border-yellow-500"
                                  : leader.rank === 2
                                    ? "border-gray-400"
                                    : "border-amber-700"
                              }`}
                            >
                              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <div className="relative mb-2">
                                  <Image
                                    src={leader.avatar || "/placeholder.svg"}
                                    alt={leader.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full border-4 border-background"
                                  />
                                  <div
                                    className={`absolute -bottom-2 -right-2 rounded-full p-1 ${
                                      leader.rank === 1
                                        ? "bg-yellow-500"
                                        : leader.rank === 2
                                          ? "bg-gray-400"
                                          : "bg-amber-700"
                                    }`}
                                  >
                                    <Trophy className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                                <h3 className="text-lg font-bold mt-2">
                                  {leader.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Rank #{leader.rank}
                                </p>
                                <p className="text-xl font-bold mt-2">
                                  {leader.earnings} STX
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {leader.wins} wins
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Player</div>
                            <div className="col-span-3 text-right">Wins</div>
                            <div className="col-span-3 text-right">
                              Earnings
                            </div>
                          </div>
                          {weeklyLeaders.slice(3).map((leader) => (
                            <div
                              key={leader.rank}
                              className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center"
                            >
                              <div className="col-span-1 font-medium">
                                {leader.rank}
                              </div>
                              <div className="col-span-5 flex items-center gap-2">
                                <Image
                                  src={leader.avatar || "/placeholder.svg"}
                                  alt={leader.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <span>{leader.name}</span>
                              </div>
                              <div className="col-span-3 text-right">
                                {leader.wins}
                              </div>
                              <div className="col-span-3 text-right font-medium">
                                {leader.earnings} STX
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="all-time">
                  <Card>
                    <CardHeader>
                      <CardTitle>All-Time Leaders</CardTitle>
                      <CardDescription>
                        The most successful players since Stacks Wars began
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-4">
                          {allTimeLeaders.slice(0, 3).map((leader) => (
                            <Card
                              key={leader.rank}
                              className={`border-2 ${
                                leader.rank === 1
                                  ? "border-yellow-500"
                                  : leader.rank === 2
                                    ? "border-gray-400"
                                    : "border-amber-700"
                              }`}
                            >
                              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <div className="relative mb-2">
                                  <Image
                                    src={leader.avatar || "/placeholder.svg"}
                                    alt={leader.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full border-4 border-background"
                                  />
                                  <div
                                    className={`absolute -bottom-2 -right-2 rounded-full p-1 ${
                                      leader.rank === 1
                                        ? "bg-yellow-500"
                                        : leader.rank === 2
                                          ? "bg-gray-400"
                                          : "bg-amber-700"
                                    }`}
                                  >
                                    <Trophy className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                                <h3 className="text-lg font-bold mt-2">
                                  {leader.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Rank #{leader.rank}
                                </p>
                                <p className="text-xl font-bold mt-2">
                                  {leader.earnings} STX
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {leader.wins} wins
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Player</div>
                            <div className="col-span-3 text-right">Wins</div>
                            <div className="col-span-3 text-right">
                              Earnings
                            </div>
                          </div>
                          {allTimeLeaders.slice(3).map((leader) => (
                            <div
                              key={leader.rank}
                              className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center"
                            >
                              <div className="col-span-1 font-medium">
                                {leader.rank}
                              </div>
                              <div className="col-span-5 flex items-center gap-2">
                                <Image
                                  src={leader.avatar || "/placeholder.svg"}
                                  alt={leader.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <span>{leader.name}</span>
                              </div>
                              <div className="col-span-3 text-right">
                                {leader.wins}
                              </div>
                              <div className="col-span-3 text-right font-medium">
                                {leader.earnings} STX
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
