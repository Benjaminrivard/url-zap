import { PrismaClient } from "@prisma/client";

import cuid from "cuid";

const prisma = new PrismaClient();
async function main() {
  await prisma.shortUrl.create({
    data: {
      sourceUrl: "https://www.google.fr/",
      targetUrl: cuid.slug(),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
