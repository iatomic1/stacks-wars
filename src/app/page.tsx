import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, Gamepad2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col mx-auto">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Compete. Play. Win STX.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join pools, play exciting games, and win Stacks
                    cryptocurrency in this competitive gaming platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/pools/create">
                    <Button size="lg" className="gap-1.5">
                      Create a Pool
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pools">
                    <Button size="lg" variant="outline">
                      Join Existing Pools
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Stacks Wars Gaming"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stacks Wars combines gaming with cryptocurrency rewards in a
                  simple process
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Create or Join a Pool</h3>
                <p className="text-center text-muted-foreground">
                  Open a pool with STX or join existing ones by depositing your
                  Stacks tokens
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Gamepad2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Play Games</h3>
                <p className="text-center text-muted-foreground">
                  Compete in various games like car arcade, WRG, or Kahoot
                  against other players
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Win Rewards</h3>
                <p className="text-center text-muted-foreground">
                  Top 3 positions share the STX from the pool based on their
                  performance
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Featured Games
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Compete in these exciting games to win STX rewards
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Car Arcade"
                  className="aspect-video object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-xl font-bold text-white">Car Arcade</h3>
                  <p className="text-white/80">Race to the finish line</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Play Now
                  </Button>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="WRG"
                  className="aspect-video object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-xl font-bold text-white">WRG</h3>
                  <p className="text-white/80">Strategic gameplay</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Play Now
                  </Button>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Kahoot-style"
                  className="aspect-video object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-xl font-bold text-white">Kahoot-style</h3>
                  <p className="text-white/80">Test your knowledge</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Play Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Ready to compete?
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Start your Stacks Wars journey today
                </h2>
                <Link href="/pools/create">
                  <Button size="lg" className="gap-1.5 mt-5">
                    Create a Pool
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Join the community
                </div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Connect with other players, share strategies, and stay updated
                  on the latest tournaments and prize pools.
                </p>
                <Link href="/community">
                  <Button variant="outline" size="lg">
                    Join Discord
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
