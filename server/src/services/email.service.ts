import sgMail from "@sendgrid/mail";
import { env } from "../config/env";

// Initialize SendGrid
if (env.SENDGRID_API_KEY && env.SENDGRID_API_KEY !== "your-sendgrid-api-key") {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

/** Data needed to send a deadline reminder email */
interface ReminderEmailData {
  to: string;
  studentName: string;
  assignmentTitle: string;
  course: string;
  deadline: Date;
  hoursRemaining: number;
}

/**
 * Email service - handles sending emails via SendGrid.
 * Falls back to console logging in development when no API key is configured.
 */
export class EmailService {
  /**
   * Send a deadline reminder email to a student.
   */
  static async sendDeadlineReminder(data: ReminderEmailData): Promise<void> {
    const deadlineStr = data.deadline.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const urgency =
      data.hoursRemaining <= 1 ? "URGENT" : "Upcoming";

    const subject = `[${urgency}] "${data.assignmentTitle}" is due in ${
      data.hoursRemaining <= 1
        ? "less than 1 hour"
        : `${Math.round(data.hoursRemaining)} hours`
    }`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Trackademic Reminder</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #4a5568; font-size: 16px; margin-top: 0;">
            Hi <strong>${data.studentName}</strong>,
          </p>
          <p style="color: #4a5568; font-size: 16px;">
            This is a reminder that your assignment is due soon:
          </p>
          <div style="background: #f7fafc; border-left: 4px solid ${
            data.hoursRemaining <= 1 ? "#e53e3e" : "#ecc94b"
          }; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <h2 style="color: #2d3748; margin: 0 0 8px 0; font-size: 18px;">${data.assignmentTitle}</h2>
            <p style="color: #718096; margin: 4px 0;"><strong>Course:</strong> ${data.course}</p>
            <p style="color: #718096; margin: 4px 0;"><strong>Deadline:</strong> ${deadlineStr}</p>
            <p style="color: ${
              data.hoursRemaining <= 1 ? "#e53e3e" : "#d69e2e"
            }; margin: 4px 0; font-weight: bold;">
              ⏱️ ${
                data.hoursRemaining <= 1
                  ? "Less than 1 hour remaining!"
                  : `About ${Math.round(data.hoursRemaining)} hours remaining`
              }
            </p>
          </div>
          <p style="color: #718096; font-size: 14px; margin-top: 24px;">
            — The Trackademic Team
          </p>
        </div>
      </div>
    `;

    // In development without SendGrid key, log the email instead
    if (!env.SENDGRID_API_KEY || env.SENDGRID_API_KEY === "your-sendgrid-api-key") {
      console.log("📧 [DEV] Email would be sent:");
      console.log(`   To: ${data.to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Assignment: ${data.assignmentTitle} (${data.course})`);
      console.log(`   Deadline: ${deadlineStr}`);
      return;
    }

    try {
      await sgMail.send({
        to: data.to,
        from: {
          email: env.SENDGRID_FROM_EMAIL,
          name: "Trackademic",
        },
        subject,
        html: htmlContent,
      });

      console.log(`📧 Reminder sent to ${data.to} for "${data.assignmentTitle}"`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${data.to}:`, error);
      throw error;
    }
  }
}
