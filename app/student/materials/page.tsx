import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentMaterials({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  await requireRole(["STUDENT", "ADMIN"]);
  const subjectId = (searchParams.subjectId as string) || "";
  const q = (searchParams.q as string) || "";
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  const materials = await prisma.material.findMany({
    where: {
      subjectId: subjectId || undefined,
      OR: q ? [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ] : undefined,
    },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Materi Pembelajaran</h1>
      <form className="mt-4 grid gap-2 md:flex md:items-end">
        <div>
          <label className="text-sm">Mata Pelajaran</label>
          <select className="h-9 w-full rounded-md border px-3 text-sm" name="subjectId" defaultValue={subjectId}>
            <option value="">Semua</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
          </select>
        </div>
        <div className="md:ml-2">
          <label className="text-sm">Cari</label>
          <input className="h-9 w-full rounded-md border px-3 text-sm" name="q" defaultValue={q} placeholder="Judul/Deskripsi" />
        </div>
        <button className="h-9 rounded-md border px-4 text-sm md:ml-2">Filter</button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map(m => (
          <Link href={`/student/materials/${m.id}`} key={m.id} className="rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="text-sm text-gray-500">{m.subject.name}</div>
            <div className="font-medium">{m.title}</div>
            {m.description && <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{m.description}</div>}
          </Link>
        ))}
      </div>
    </main>
  );
}

