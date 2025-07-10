// src/lib/send-email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables');
}

if (!process.env.EMAIL_FROM) {
  console.error('❌ EMAIL_FROM is not set in environment variables');
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { 
      success: false, 
      error: 'Email service is not properly configured' 
    };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (!data) {
      throw new Error('No response from email service');
    }

    if ('error' in data) {
      throw new Error(data.error?.message || 'Failed to send email');
    }

    return { success: true, id: (data as any).id };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email'
    };
  }
}
