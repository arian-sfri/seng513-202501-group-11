import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",              // this is dialect: "singlestore" in the video but is giving an error
  tablesFilter: ["cloudsync_*"],      // probably gonna need to change this sometime because of the db name
} satisfies Config;
