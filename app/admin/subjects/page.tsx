import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function SubjectsPage() {
  await requireRole(["ADMIN"]);
  const subjects = await prisma.subject.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Mata Pelajaran</h1>
      <form action={createSubject} className="mt-4 grid gap-2 sm:flex sm:items-end">
        <div className="sm:w-1/3">
          <label className="text-sm">Nama</label>
          <Input name="name" required />
        </div>
        <div className="sm:w-1/3">
          <label className="text-sm">Tingkat/Kelas</label>
          <Input name="grade" required placeholder="7/8/9/10/12/UTBK" />
        </div>
        <div className="sm:w-1/3">
          <label className="text-sm">Deskripsi</label>
          <Input name="description" />
        </div>
        <Button type="submit">Tambah</Button>
      </form>
      <div className="mt-6 grid gap-3">
        {subjects.map(s => (
          <div key={s.id} className="rounded-md border p-3">
            <div className="font-medium">{s.name} <span className="text-xs text-gray-500">({s.grade})</span></div>
            {s.description && <div className="text-sm text-gray-600 dark:text-gray-300">{s.description}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}

async function createSubject(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const grade = String(formData.get("grade") || "").trim();
  const description = String(formData.get("description") || "").trim() || undefined;
  if (!name || !grade) return;
  await prisma.subject.create({ data: { name, grade, description } });
}

