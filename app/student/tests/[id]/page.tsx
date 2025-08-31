import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import TestRunner from "@/components/test/test-runner";

export default async function TakeTestPage({ params }: { params: { id: string } }) {
  await requireRole(["STUDENT", "ADMIN"]);
  const test = await prisma.test.findUnique({ where: { id: params.id }, include: { questions: true, subject: true } });
  if (!test || !test.isActive) return <div className="container mx-auto px-4 py-8">Tryout tidak tersedia.</div>;
  if (test.questions.length === 0) return <div className="container mx-auto px-4 py-8">Belum ada soal pada tryout ini.</div>;
  const questions = test.questions.map((q) => ({ id: q.id, question: q.question, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD }));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="text-sm text-gray-500">{test.subject.name} • Durasi {test.duration} menit</div>
        <h1 className="text-2xl font-semibold">{test.title}</h1>
      </div>
      <TestRunner testId={test.id} duration={test.duration} questions={questions} />
    </main>
  );
}

