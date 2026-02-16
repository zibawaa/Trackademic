import { PrismaClient, Priority } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@trackademic.com" },
    update: {},
    create: {
      email: "demo@trackademic.com",
      name: "Demo Student",
      passwordHash,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample assignments
  const now = new Date();
  const assignments = [
    {
      title: "Data Structures Final Project",
      description: "Implement a balanced BST with visualization",
      course: "CS 201",
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: Priority.HIGH,
      userId: user.id,
    },
    {
      title: "Linear Algebra Problem Set 5",
      description: "Eigenvalues and eigenvectors exercises 1-15",
      course: "MATH 240",
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      priority: Priority.MEDIUM,
      userId: user.id,
    },
    {
      title: "History Essay Draft",
      description: "First draft of research essay on the Industrial Revolution",
      course: "HIST 101",
      deadline: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours
      priority: Priority.URGENT,
      userId: user.id,
    },
    {
      title: "Physics Lab Report",
      description: "Write up results from the optics experiment",
      course: "PHYS 150",
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      priority: Priority.LOW,
      userId: user.id,
    },
    {
      title: "Database Design ER Diagram",
      description: "Complete ER diagram for the library management system project",
      course: "CS 201",
      deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
      priority: Priority.HIGH,
      userId: user.id,
    },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.create({ data: assignment });
  }

  console.log(`✅ Created ${assignments.length} sample assignments`);
  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
