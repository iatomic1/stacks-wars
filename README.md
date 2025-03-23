# Stacks Wars

Stacks Wars is a **gaming utility platform** built on the **Stacks blockchain**, offering various game types such as **casino games, sports betting, casual games, and aviator-style games**. Players can participate using **STX** as the primary mode of payment.

## Features

-   **Multiple Game Modes:** Includes casino, sports betting, casual games, and more.
-   **Lexi War (Spelling Mini-Game):** Turn-based spelling game with real-time multiplayer in future updates.
-   **Blockchain-Powered Betting:** Uses STX for transactions.
-   **Progressive Difficulty:** Games increase in complexity based on player performance.
-   **Word Validation API:** Utilizes Wordnik API for spelling-based game validation.
-   **User Authentication & Wallet Integration:** Seamlessly connects with Stacks wallets for transactions.
-   **On-Chain Gaming Pools:** Users can create and join betting pools using smart contracts.

## Tech Stack

-   **Frontend:** Next.js, React, Tailwind CSS
-   **Backend:** Node.js (Planned for backend logic)
-   **Smart Contracts:** Clarity (for on-chain interactions) - [Stacks Wars Pool Contract](https://github.com/your-repo-link)
-   **Hosting:** Vercel

## Installation & Setup

To set up the project locally:

```sh
git clone https://github.com/iatomic1/stacks-wars
cd stacks-wars
bun install
bun dev
```

## How to Play (Lexi War)

1. **Start a Game:** Choose a game mode (turn-based initially).
2. **Enter Words:** Type words based on given letter constraints.
3. **Progress Difficulty:** Longer words are required as the game progresses.
4. **Win or Lose:** If no valid word is entered before time runs out, the opponent wins.

## Smart Contract: Stacks Wars Pool Contract

We have an on-chain betting system where users can create and join gaming pools using smart contracts written in Clarity. This contract handles:

-   **Pool Creation:** Users can create betting pools with a fixed entry fee.
-   **Joining Pools:** Players join pools by paying the entry fee.
-   **Reward Claims:** Winners claim rewards using signed messages.

You can check out the contract [here](https://github.com/iflames1/stacks-wars-contract).

## Roadmap

-   ✅ Initial game release with **Lexi War** (turn-based mode)
-   🚀 Real-time multiplayer support
-   💰 On-chain betting and rewards system
-   📊 Leaderboard & ranking system
-   🎨 Improved UI/UX animations & effects

## Contribution

We welcome contributions! Feel free to fork the repo and submit a pull request.

## License

MIT License

## Contact

For questions, reach out via Twitter or Discord.

🚀 **Stacks Wars – Where Gaming Meets DeFi!**
