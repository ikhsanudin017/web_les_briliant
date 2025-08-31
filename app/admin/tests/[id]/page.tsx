import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ManageTestPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const test = await prisma.test.findUnique({ where: { id: params.id }, include: { subject: true, questions: true } });
  if (!test) return <div className="container mx-auto px-4 py-8">Tryout tidak ditemukan.</div>;
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{test.title} <span className="text-sm text-gray-500">({test.subject.name})</span></h1>
        <a href={`/admin/tests/${test.id}/settings`} className="text-sm rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-900">Pengaturan</a>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <form action={addQuestion.bind(null, test.id)} className="grid gap-2">
          <h2 className="font-medium">Tambah Soal</h2>
          <Input name="question" placeholder="Pertanyaan" required />
          <div className="grid grid-cols-2 gap-2">
            <Input name="optionA" placeholder="Opsi A" required />
            <Input name="optionB" placeholder="Opsi B" required />
            <Input name="optionC" placeholder="Opsi C" required />
            <Input name="optionD" placeholder="Opsi D" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input name="correctAnswer" placeholder="Jawaban Benar (A/B/C/D)" required />
            <Input name="explanation" placeholder="Pembahasan (opsional)" />
          </div>
          <Button type="submit">Tambah</Button>
        </form>

        <form action={importCsv.bind(null, test.id)} className="grid gap-2" encType="multipart/form-data">
          <h2 className="font-medium">Import CSV</h2>
          <input name="file" type="file" accept="text/csv" required />
          <p className="text-xs text-gray-500">Format: question,optionA,optionB,optionC,optionD,correctAnswer,explanation</p>
          <Button type="submit">Import</Button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="font-medium">Daftar Soal ({test.questions.length})</h2>
        <div className="mt-3 grid gap-3">
          {test.questions.map(q => (
            <div key={q.id} className="rounded-md border p-3">
              <div className="font-medium">{q.question}</div>
              <div className="text-sm">A. {q.optionA} | B. {q.optionB} | C. {q.optionC} | D. {q.optionD}</div>
              <div className="text-sm text-green-600">Jawaban: {q.correctAnswer}</div>
              {q.explanation && <div className="text-sm text-gray-600 dark:text-gray-300">Pembahasan: {q.explanation}</div>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

async function addQuestion(testId: string, formData: FormData) {
  "use server";
  const question = String(formData.get("question") || "");
  const optionA = String(formData.get("optionA") || "");
  const optionB = String(formData.get("optionB") || "");
  const optionC = String(formData.get("optionC") || "");
  const optionD = String(formData.get("optionD") || "");
  const correctAnswer = String(formData.get("correctAnswer") || "").toUpperCase();
  const explanation = String(formData.get("explanation") || "").trim() || undefined;
  if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) return;
  await prisma.question.create({ data: { testId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation } });
}

async function importCsv(testId: string, formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  if (!file) return;
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = lines.map(l => l.split(",").map(c => c.replace(/^"|"$/g, "").replace(/""/g, '"')));
  const data = rows.map((r) => ({
    question: r[0], optionA: r[1], optionB: r[2], optionC: r[3], optionD: r[4], correctAnswer: (r[5] || "A").toUpperCase(), explanation: r[6] || undefined
  })).filter(d => d.question && d.optionA && d.optionB && d.optionC && d.optionD);
  if (!data.length) return;
  await prisma.question.createMany({ data: data.map(d => ({ testId, ...d })) });
}
