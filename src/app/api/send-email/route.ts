// app/api/send-payment-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/send-email';

export async function POST(req: Request) {
  const body = await req.json();

  const { to, subject, html } = body;

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const result = await sendEmail({ to, subject, html });

  if (result.success) {
    return NextResponse.json({ success: true, id: result.id ?? null });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
}
