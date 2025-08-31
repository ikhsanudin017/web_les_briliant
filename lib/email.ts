// Basic email sender. For production, configure SMTP credentials.
// If SMTP env vars are missing, this falls back to console logging.
import type { Test, User } from "@prisma/client";

type ResultEmailPayload = {
  user: Pick<User, "name" | "email">;
  test: Pick<Test, "title">;
  score: number;
};

export async function sendResultEmail(payload: ResultEmailPayload) {
  const { user, test, score } = payload;
  const host = process.env.SMTP_HOST;
  const userEnv = process.env.SMTP_USER;
  const passEnv = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || "no-reply@brilliant-les.id";

  if (!host || !userEnv || !passEnv) {
    console.log("[EMAIL:DEV] Result:", { to: user.email, test: test.title, score });
    return { ok: true, dev: true } as const;
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: userEnv, pass: passEnv },
  });

  await transporter.sendMail({
    from,
    to: user.email,
    subject: `Hasil Tryout: ${test.title}`,
    html: `<p>Halo ${user.name ?? "Siswa"},</p>
           <p>Anda telah menyelesaikan tryout <b>${test.title}</b>.</p>
           <p>Nilai Anda: <b>${score}</b></p>
           <p>Terima kasih telah belajar bersama Brilliant!</p>`
  });

  return { ok: true } as const;
}

