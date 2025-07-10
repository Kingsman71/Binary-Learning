// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentConfirmationEmail({
  to,
  name,
  program,
}: {
  to: string;
  name: string;
  program: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Binary Bakery <noreply@binarybakery.ai>', // domain must be verified in Resend
      to: [to],
      subject: '🎉 Payment Confirmation - Binary Bakery Academy',
      html: `<p>Hi ${name},</p>
             <p>Thank you for completing your payment for the <strong>${program}</strong> program.</p>
             <p>We’re excited to have you onboard! You’ll receive further instructions soon.</p>
             <p>— Binary Bakery Academy Team</p>`,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Email error:', err);
  }
}
