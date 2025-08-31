import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TestsPage() {
  await requireRole(["ADMIN"]);
  const tests = await prisma.test.findMany({ include: { subject: true }, orderBy: { createdAt: "desc" } });
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Kelola Tryout</h1>
      <form action={createTest} className="mt-4 grid gap-2">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Judul</label>
            <Input name="title" required />
          </div>
          <div>
            <label className="text-sm">Mata Pelajaran</label>
            <select className="h-9 w-full rounded-md border px-3 text-sm" name="subjectId" required>
              <option value="">-- Pilih --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Deskripsi</label>
            <Input name="description" />
          </div>
          <div>
            <label className="text-sm">Durasi (menit)</label>
            <Input name="duration" type="number" min={1} required />
          </div>
        </div>
        <Button type="submit">Buat Tryout</Button>
      </form>

      <div className="mt-6 grid gap-3">
        {tests.map(t => (
          <div key={t.id} className="rounded-md border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title} <span className="text-xs text-gray-500">({t.subject.name})</span></div>
              <div className="text-sm text-gray-500">Durasi: {t.duration} menit</div>
            </div>
            <div className="flex items-center gap-2">
              <Link className="text-sm underline" href={`/admin/tests/${t.id}`}>Kelola Soal</Link>
              <Link className="text-sm rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-900" href={`/admin/tests/${t.id}/settings`}>Pengaturan</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

async function createTest(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "");
  const subjectId = String(formData.get("subjectId") || "");
  const description = String(formData.get("description") || "").trim() || undefined;
  const duration = Number(formData.get("duration") || 0);
  if (!title || !subjectId || !duration) return;
  await prisma.test.create({ data: { title, subjectId, description, duration, isActive: true } });
}
