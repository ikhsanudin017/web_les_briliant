import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function upsertAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@brilliant-les.id";
  const name = process.env.ADMIN_NAME || "Administrator";
  const password = process.env.ADMIN_PASSWORD || "admin123"; // for dev only
  const passwordHash = await hash(password, 10);

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
    return { email, isNew: false };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: "ADMIN",
    },
  });
  return { email, isNew: true };
}

async function seedSubjects() {
  const subjects: { name: string; grade: string; description?: string }[] = [
    { name: "Matematika", grade: "SMP", description: "Konsep dasar hingga menengah." },
    { name: "Bahasa Indonesia", grade: "SMP", description: "Pemahaman bacaan & menulis." },
    { name: "IPA Terpadu", grade: "SMP", description: "Fisika, Kimia, Biologi dasar." },
    { name: "Matematika", grade: "SMA", description: "Aljabar, trigonometri, kalkulus dasar." },
  ];

  const created: string[] = [];
  for (const s of subjects) {
    const exists = await prisma.subject.findFirst({ where: { name: s.name, grade: s.grade } });
    if (!exists) {
      await prisma.subject.create({ data: s });
      created.push(`${s.name} (${s.grade})`);
    }
  }
  return created;
}

async function maybeSeedSampleTest() {
  // Find any subject to attach a test
  const subj = await prisma.subject.findFirst({ where: { name: "Matematika", grade: "SMP" } });
  if (!subj) return false;
  const exists = await prisma.test.findFirst({ where: { title: "Contoh Tryout Matematika" } });
  if (exists) return false;

  const test = await prisma.test.create({
    data: {
      title: "Contoh Tryout Matematika",
      description: "Tryout contoh 5 soal",
      duration: 15,
      subjectId: subj.id,
      isActive: true,
    },
  });
  await prisma.question.createMany({
    data: [
      { testId: test.id, question: "2 + 3 = ?", optionA: "4", optionB: "5", optionC: "6", optionD: "7", correctAnswer: "B", explanation: "2 + 3 = 5" },
      { testId: test.id, question: "10 - 4 = ?", optionA: "5", optionB: "6", optionC: "7", optionD: "8", correctAnswer: "B" },
    ],
  });
  return true;
}

async function main() {
  console.log("Seeding: admin, subjects, sample test...");
  const admin = await upsertAdmin();
  const subjects = await seedSubjects();
  const sample = await maybeSeedSampleTest();
  console.log(`Admin ${admin.email} ${admin.isNew ? "dibuat" : "diupdate"} dengan role ADMIN.`);
  if (subjects.length) console.log("Subjects dibuat:", subjects.join(", "));
  else console.log("Subjects sudah ada, tidak dibuat ulang.");
  console.log(sample ? "Contoh tryout dibuat." : "Contoh tryout sudah ada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

