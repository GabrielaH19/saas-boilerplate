import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { welcomeEmail } from "@/app/lib/email-templates";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  const { subject, html } = welcomeEmail(name);
  await sendEmail({ to: email, subject, html });
  return NextResponse.json({ ok: true });
}