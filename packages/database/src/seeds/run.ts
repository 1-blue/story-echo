import { PrismaClient } from "@prisma/client";
import { getSeedProfile } from "./config";
import { runDevSeed } from "./dev";
import { runProdSeed } from "./prod";

const prisma = new PrismaClient();

async function main() {
  const profile = getSeedProfile();
  console.log(`🌱 StoryEcho seed (${profile})\n`);

  if (profile === "prod") {
    await runProdSeed({ prisma });
  } else {
    await runDevSeed({ prisma });
  }

  console.log("\n✅ Seed 완료");
}

main()
  .catch((error) => {
    console.error("❌ Seed 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
