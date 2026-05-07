import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const result = await resend.emails.send({
      from: "Pharos English Lab <contact@pharosenglishlab.com>",
      to: ["pharosenglishlab@gmail.com"],
      replyTo: email,
      subject: `Pharos Contact: ${subject || "New message"}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    console.log("RESEND RESULT:", result);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}