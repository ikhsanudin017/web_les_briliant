import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendResultEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;
    const { testId, answers } = await req.json();
    const test = await prisma.test.findUnique({ where: { id: testId }, include: { questions: true } });
    if (!test) return NextResponse.json({ message: "Test not found" }, { status: 404 });

    // Score calculation
    let correct = 0;
    for (const q of test.questions) {
      const ans = answers?.[q.id];
      if (ans && typeof ans === "string" && ans.toUpperCase() === q.correctAnswer.toUpperCase()) correct += 1;
    }
    const score = test.questions.length ? (correct / test.questions.length) * 100 : 0;

    const result = await prisma.testResult.create({
      data: { userId, testId, answers, score }
    });

    // Send email if possible
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await sendResultEmail({ user: { name: user.name, email: user.email } as any, test: { title: test.title } as any, score });
    }

    return NextResponse.json({ id: result.id, score }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

