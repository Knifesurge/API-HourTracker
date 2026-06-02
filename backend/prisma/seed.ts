import { prisma } from "../src/lib/prisma.js";
import bcrypt from 'bcryptjs';

const ACTIVITY_NAMES = [
  "Coding",
  "Gym",
  "Reading",
  "Gaming",
  "Writing",
  "Cooking",
  "Running",
  "Studying",
  "Music",
  "Watching TV",
  "Design",
  "Walking",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate(daysBack: number) {
  const now = new Date();
  const past = new Date(
    now.getTime() - randomInt(1, daysBack) * 24 * 60 * 60 * 1000
  );

  past.setHours(randomInt(6, 22));
  past.setMinutes(randomInt(0, 59));

  return past;
}

async function main() {
  await prisma.timeEntry.deleteMany();
  await prisma.userActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();

  /*
    GLOBAL ACTIVITIES
  */

  const activities = await Promise.all(
    ACTIVITY_NAMES.map((name) =>
      prisma.activity.create({
        data: { name },
      })
    )
  );

  const activityMap = new Map(
    activities.map((activity) => [activity.name, activity])
  );

  /*
    USERS
  */

    // Hash the dummy password
  const hashedPassword = await bcrypt.hash('password123', 10);

  const usersData = [
    { name: "Admin", email: "admin@example.com", password: hashedPassword },
    { name: "Nick", email: "nick@example.com", password: hashedPassword },
    { name: "Jar", email: "jar@example.com", password: hashedPassword },
    { name: "Sarah", email: "sarah@example.com", password: hashedPassword },
    { name: "Michael", email: "michael@example.com", password: hashedPassword },
    { name: "Emily", email: "emily@example.com", password: hashedPassword },
    { name: "Daniel", email: "daniel@example.com", password: hashedPassword },
    { name: "Jessica", email: "jessica@example.com", password: hashedPassword },
    { name: "Chris", email: "chris@example.com", password: hashedPassword },
    { name: "Olivia", email: "olivia@example.com", password: hashedPassword },
  ];

  const users = [];

  for (let i = 0; i < usersData.length; i++) {
    const userData = usersData[i];

    if (!userData) continue;  // Guard against undefined to satisfy checks

    const user = await prisma.user.create({
      data: userData,
    });

    users.push(user);

    /*
      ASSIGN ACTIVITIES
    */

    let assignedActivities: string[];

    if (i === 0) {
      // Admin gets 5 default activities
      assignedActivities = [
        "Coding",
        "Gym",
        "Reading",
        "Gaming",
        "Writing",
      ];
    } else {
      const shuffled = [...ACTIVITY_NAMES].sort(() => 0.5 - Math.random());

      assignedActivities = shuffled.slice(0, randomInt(3, 6));
    }

    for (const activityName of assignedActivities) {
      const activity = activityMap.get(activityName);

      if (!activity) continue;

      await prisma.userActivity.create({
        data: {
          userId: user.id,
          activityId: activity.id,
        },
      });
    }

    /*
      CREATE TIME ENTRIES
    */

    const userActivities = assignedActivities
      .map((name) => activityMap.get(name))
      .filter(Boolean);

    const entryCount = randomInt(2, 6);

    for (let j = 0; j < entryCount; j++) {
      const activity =
        userActivities[randomInt(0, userActivities.length - 1)];

      if (!activity) continue;

      const startTime = randomPastDate(30);

      const durationSeconds = randomInt(1800, 14400); // 30 mins -> 4 hours

      const endTime = new Date(
        startTime.getTime() + durationSeconds * 60_000
      );

      await prisma.timeEntry.create({
        data: {
          userId: user.id,
          activityId: activity.id,
          startTime,
          endTime,
          duration: durationSeconds,
        },
      });
    }
  }

  console.log("Database seeded successfully.");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });