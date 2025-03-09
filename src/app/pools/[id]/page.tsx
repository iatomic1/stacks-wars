import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Users,
  Trophy,
  Gamepad2,
  Info,
  Medal,
  User,
  ChevronRight,
} from "lucide-react";
import { getPoolById } from "@/lib/services/pools";
import { notFound } from "next/navigation";

export default async function PoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const poolId = (await params).id;
  const pool = await getPoolById(poolId);

  if (!pool) {
    notFound();
  }

  // Calculate participation percentage
  const participationPercentage =
    (pool.participants.length / pool.maxPlayers) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <main className="flex-1">
        <div className="container max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <Link
            href="/pools"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pools</span>
          </Link>

          {/* Hero Section */}
          <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">
                {pool.name}
              </h1>
              <Badge
                variant={pool.status === "open" ? "default" : "secondary"}
                className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium mt-1"
              >
                {pool.status === "open" ? "Open for Entry" : "Pool Full"}
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl break-words">
              {pool.description}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Prize Pool
                        </p>
                        <p className="text-base sm:text-xl md:text-2xl font-bold">
                          {pool.amount} STX
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Players
                        </p>
                        <p className="text-base sm:text-xl md:text-2xl font-bold">
                          {pool.participants.length}/{pool.maxPlayers}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors xs:col-span-2 sm:col-span-1">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Game
                        </p>
                        <p className="text-base sm:text-xl md:text-2xl font-bold">
                          {pool.game.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pool Details */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 p-4 pb-3 sm:p-6 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    Pool Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="sm:p-6">
                  <div className="">
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                        Pool Progress
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>{pool.participants.length} joined</span>
                          <span>{pool.maxPlayers} max</span>
                        </div>
                        <Progress
                          value={participationPercentage}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                        Created by
                      </h3>
                      <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm sm:text-base font-medium truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-[300px]">
                              {pool.creator.stxAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 p-4 pb-3 sm:p-6 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    Prize Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {pool.prizeDistributions.map((prize) => {
                      const medalColors = {
                        1: "text-yellow-500",
                        2: "text-slate-400",
                        3: "text-amber-700",
                      };

                      const bgColors = {
                        1: "bg-yellow-500/10",
                        2: "bg-slate-400/10",
                        3: "bg-amber-700/10",
                      };

                      return (
                        <div
                          key={prize.position}
                          className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full ${bgColors[prize.position as 1 | 2 | 3]}`}
                            >
                              <Medal
                                className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${medalColors[prize.position as 1 | 2 | 3]}`}
                              />
                            </div>
                            <div>
                              <p className="text-sm sm:text-base font-medium">
                                {prize.position === 1
                                  ? "1st Place"
                                  : prize.position === 2
                                    ? "2nd Place"
                                    : "3rd Place"}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {(
                                  (Number(pool.amount) * prize.percentage) /
                                  100
                                ).toFixed(2)}{" "}
                                STX
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg sm:text-xl font-bold">
                              {prize.percentage}%
                            </span>
                            <p className="text-xs text-muted-foreground">
                              of pool
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 p-4 pb-3 sm:p-6 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    Current Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {pool.participants.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {pool.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm sm:text-base font-medium truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-[300px]">
                                {participant.user.stxAddress}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-bold">
                              {participant.amount} STX
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted/50 flex items-center justify-center mb-3 sm:mb-4">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium mb-1">
                        No participants yet
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                        Be the first to join this pool and get a chance to win
                        the prize!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Join Pool Form */}
              <div className="lg:sticky lg:top-6 flex flex-col gap-4">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base">
                      Game Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Image
                      src="/placeholder.svg?height=300&width=500"
                      width={500}
                      height={300}
                      alt="Game preview"
                      className="w-full h-auto object-cover"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between p-3 sm:p-4 bg-muted/30">
                    <p className="text-xs sm:text-sm font-medium">
                      {pool.game.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 text-xs sm:text-sm gap-1 px-2 sm:px-3"
                    >
                      Game details
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
