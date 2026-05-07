import prisma from "../src/lib/prisma.js";

async function main() {
    await prisma.timeEntry.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
        data: {
            email: "nick@example.com",
            name: "Nick",
            activities: {
                create: [
                    { name: 'Coding' },
                    { name: 'Gym' },
                ],
            },
        },
        include: {
            activities: true
        }
    });

    const timeEntry = await prisma.timeEntry.create({
        data: {
            userId: user.id,
            activityId: user.activities[0]?.id,
            startTime: new Date(),
            duration: 3600
        }
    })
};

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });