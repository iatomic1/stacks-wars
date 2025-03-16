//import { drizzle } from "drizzle-orm/postgres-js";
//import env from "../env";
//import * as users from "./schema/users";
//import * as games from "./schema/games";
//import * as leaderboard from "./schema/leaderboard-entries";
//import * as participants from "./schema/participants";
//import * as pools from "./schema/pools";
//import * as prizes from "./schema/prize-distributions";
//import * as relations from "./schema/relations";

//export const db = drizzle({
//  connection: {
//    url: env.DATABASE_URL,
//    ssl: false,
//    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : 1,
//    onnotice: env.DB_SEEDING ? () => {} : undefined,
//  },
//  casing: "snake_case",
//  logger: true,
//  schema: {
//    ...games,
//    ...users,
//    ...leaderboard,
//    ...participants,
//    ...pools,
//    ...prizes,
//    ...relations,
//  },
//});
