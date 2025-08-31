import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentTests({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  await requireRole(["STUDENT", "ADMIN"]);
  const subjectId = (searchParams.subjectId as string) || "";
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  const tests = await prisma.test.findMany({ where: { isActive: true, subjectId: subjectId || undefined }, include: { subject: true }, orderBy: { createdAt: "desc" } });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Tryout & Latihan</h1>
      <form className="mt-4">
        <label className="text-sm">Mata Pelajaran</label>
        <select className="h-9 w-full rounded-md border px-3 text-sm" name="subjectId" defaultValue={subjectId}>
          <option value="">Semua</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
        </select>
      </form>

      <div className="mt-6 grid gap-3">
        {tests.map(t => (
          <div key={t.id} className="rounded-md border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-500">{t.subject.name} • Durasi {t.duration} menit</div>
            </div>
            <Link className="text-sm underline" href={`/student/tests/${t.id}`}>Mulai</Link>
          </div>
        ))}
      </div>
    </main>
  );
}

