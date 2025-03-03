import { PrasaranaDummy } from "@/constants/dummy-data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const prasarana = await prisma.prasarana.createMany({ data: PrasaranaDummy });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });
