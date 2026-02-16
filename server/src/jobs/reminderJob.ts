import cron from "node-cron";
import prisma from "../config/database";
import { EmailService } from "../services/email.service";

/**
 * Deadline Reminder Cron Job
 *
 * Runs every 15 minutes and checks for assignments that:
 * 1. Are not completed
 * 2. Have deadlines within the next 24 hours (sends 24h reminder)
 * 3. Have deadlines within the next 1 hour (sends 1h reminder)
 *
 * Each reminder is only sent once (tracked by reminder flags on the assignment).
 */
export function startReminderJob(): void {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("🔔 Running deadline reminder check...");

    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const twentyFourHoursFromNow = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );

      // Find assignments needing 24-hour reminders
      const assignments24h = await prisma.assignment.findMany({
        where: {
          isCompleted: false,
          reminder24hSent: false,
          deadline: {
            gt: now,
            lte: twentyFourHoursFromNow,
          },
        },
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
      });

      // Find assignments needing 1-hour reminders
      const assignments1h = await prisma.assignment.findMany({
        where: {
          isCompleted: false,
          reminder1hSent: false,
          deadline: {
            gt: now,
            lte: oneHourFromNow,
          },
        },
        include: {
          user: {
            select: { email: true, name: true },
          },
        },
      });

      // Send 24-hour reminders
      for (const assignment of assignments24h) {
        const hoursRemaining =
          (assignment.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

        try {
          await EmailService.sendDeadlineReminder({
            to: assignment.user.email,
            studentName: assignment.user.name,
            assignmentTitle: assignment.title,
            course: assignment.course,
            deadline: assignment.deadline,
            hoursRemaining,
          });

          // Mark reminder as sent
          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { reminder24hSent: true },
          });
        } catch (error) {
          console.error(
            `❌ Failed to send 24h reminder for "${assignment.title}":`,
            error
          );
        }
      }

      // Send 1-hour reminders
      for (const assignment of assignments1h) {
        const hoursRemaining =
          (assignment.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

        try {
          await EmailService.sendDeadlineReminder({
            to: assignment.user.email,
            studentName: assignment.user.name,
            assignmentTitle: assignment.title,
            course: assignment.course,
            deadline: assignment.deadline,
            hoursRemaining,
          });

          // Mark reminder as sent
          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { reminder1hSent: true },
          });
        } catch (error) {
          console.error(
            `❌ Failed to send 1h reminder for "${assignment.title}":`,
            error
          );
        }
      }

      const totalSent = assignments24h.length + assignments1h.length;
      if (totalSent > 0) {
        console.log(`🔔 Sent ${totalSent} reminder(s)`);
      }
    } catch (error) {
      console.error("❌ Reminder job failed:", error);
    }
  });

  console.log("🔔 Deadline reminder cron job started (runs every 15 minutes)");
}
