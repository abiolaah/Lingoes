import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Database.....");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "English",
        imageSrc: "/flags/l/us.svg",
      },
      {
        id: 2,
        title: "French",
        imageSrc: "/flags/l/fr.svg",
      },
      {
        id: 3,
        title: "Spanish",
        imageSrc: "/flags/l/es.svg",
      },
      {
        id: 4,
        title: "Italian",
        imageSrc: "/flags/l/it.svg",
      },
    ]);

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
  }
};

main();
