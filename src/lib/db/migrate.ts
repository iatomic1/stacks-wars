//import { migrate } from "drizzle-orm/postgres-js/migrator";
//import env from "../env";
//import { db } from ".";
//import drizzleConfig from "../../../drizzle.config";

//if (!env.DB_MIGRATING) {
//  throw new Error(
//    'You must set DB_MIGRATING to "true" when running migrations',
//  );
//}

//await migrate(db, { migrationsFolder: drizzleConfig.out! });
//await db.$client.end();
