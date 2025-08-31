import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ResultDetail({ params }: { params: { id: string } }) {
  await requireRole(["STUDENT", "ADMIN"]);
  const session = await getServerSession(authOptions);
  const result = await prisma.testResult.findUnique({ where: { id: params.id }, include: { test: { include: { questions: true } } } });
  if (!result || result.userId !== session!.user.id) return <div className="container mx-auto px-4 py-8">Hasil tidak ditemukan</div>;
  const answers = result.answers as Record<string, string>;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Review: {result.test.title} <span className="text-sm text-gray-500">Skor {result.score.toFixed(1)}</span></h1>
      <div className="mt-6 grid gap-3">
        {result.test.questions.map((q, i) => {
          const ans = (answers?.[q.id] || "").toUpperCase();
          const ok = ans === q.correctAnswer.toUpperCase();
          return (
            <div key={q.id} className="rounded-md border p-3">
              <div className="text-sm text-gray-500">Soal {i+1}</div>
              <div className="font-medium">{q.question}</div>
              <div className="text-sm">A. {q.optionA} | B. {q.optionB} | C. {q.optionC} | D. {q.optionD}</div>
              <div className={`text-sm mt-1 ${ok? 'text-green-600' : 'text-red-600'}`}>Jawaban Anda: {ans || '-'} • Kunci: {q.correctAnswer}</div>
              {q.explanation && <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Pembahasan: {q.explanation}</div>}
            </div>
          );
        })}
      </div>
    </main>
  );
}

