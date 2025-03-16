# Stacks Wars - Competitive Word Gaming Platform

Stacks Wars is a competitive gaming platform built on the Stacks blockchain, featuring word-based games where players can compete for STX rewards. Our flagship game, Lexi War, challenges players' vocabulary and typing speed in an exciting battle royale format.

## Featured Game: Lexi War

Lexi War is a fast-paced word game where players:

-   Type valid English words (minimum 4 characters)
-   Race against a 10-second countdown timer
-   Score points based on word length
-   Compete in real-time against other players
-   Win STX rewards from the prize pool

### Anti-Cheat Features

-   No copy/paste allowed
-   No screen reader support in competitive mode
-   Real-time word validation
-   Fair play monitoring

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

-   **Framework**: Next.js 14 with App Router
-   **Styling**: Tailwind CSS
-   **UI Components**: Shadcn/ui
-   **State Management**: React Hooks
-   **Blockchain**: Stacks
-   **Font**: Geist (Sans & Mono)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable UI components
├── lib/               # Utilities and shared functions
├── context/          # React context providers
└── config/           # Application configuration
```

## Features

-   **Modern UI/UX**: Clean, responsive design with smooth animations
-   **Real-time Gaming**: Fast-paced word gameplay
-   **Blockchain Integration**: STX rewards and transactions
-   **Competitive Features**: Anti-cheat mechanisms and fair play
-   **Social Elements**: Multiplayer lobbies and competitions

## Development

The project uses several key dependencies:

-   `shadcn/ui` for component library
-   `lucide-react` for icons
-   `tailwindcss` for styling
-   `sonner` for toast notifications

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue in the repository.
