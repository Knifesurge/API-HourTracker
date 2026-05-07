import prisma from "../src/lib/prisma.js";

async function main() {
    await prisma.timeEntry.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({
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

    const user2 = await prisma.user.create({
        data: {
            email: "jar@example.com",
            name: "Jar",
            activities: {
                create: [
                    { name: 'Gaming' },
                    { name: 'Working' },
                    { name: "Watching TV" },
                ],
            },
        },
        include: {
            activities: true
        }
    })

    const timeEntry = await prisma.timeEntry.create({
        data: {
            userId: user1.id,
            activityId: Number(user1.activities[0]?.id),
            startTime: new Date(),
            duration: 3600
        }
    });

    const timeEntry2 = await prisma.timeEntry.create({
        data: {
            userId: user2.id,
            activityId: Number(user2.activities[0]?.id),
            startTime: new Date(),
            duration: 4200
        }
    });
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