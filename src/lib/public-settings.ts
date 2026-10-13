import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export type dbPublicSettings = Record<string, string>;

export const getSettings = unstable_cache(
  async (): Promise<dbPublicSettings> => {
    const rows = await db.setting.findMany();
    const out: dbPublicSettings = {};
    for (const r of rows) out[r.key] = r.value;
    return out;
  },
  ["clinic-settings"],
  { revalidate: 60 }
);
