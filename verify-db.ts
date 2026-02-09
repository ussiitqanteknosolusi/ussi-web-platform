import 'dotenv/config';
import { db } from "./lib/prisma";

async function main() {
  try {
    console.log("Connecting to database...");
    const clientCount = await db.client.count();
    console.log(`Successfully connected. Client count: ${clientCount}`);
    
    const services = await db.service.findMany({ select: { slug: true } });
    console.log(`Services found: ${services.length}`);
    
    console.log("Database verification successful.");
  } catch (error) {
    console.error("Database verification failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
