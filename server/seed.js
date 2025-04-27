const { prisma } = require("./common");

async function seed() {
  try {
    await prisma.item.create({
      data: {
        name: "Grilled Cheese",
      },
    });
    await prisma.item.create({
      data: {
        name: "Ham & Cheese",
      },
    });
    await prisma.item.create({
      data: {
        name: "Meatball Sub",
      },
    });
    await prisma.item.create({
      data: {
        name: "Philly Cheesesteak",
      },
    });
    await prisma.item.create({
      data: {
        name: "Veggie",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
if (require.main === module) {
  seed();
}
module.exports = seed;
