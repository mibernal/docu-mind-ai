// apps/api/src/prisma/prisma.config.ts
import { defineDatasource } from "@prisma/config";
import { BetterSqlite3Adapter } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

export default {
  datasources: {
    db: defineDatasource({
      url: "file:./dev.db",
      adapter: new BetterSqlite3Adapter(new Database("dev.db")),
    }),
  },
};
