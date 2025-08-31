import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function EditSubjectPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const subject = await prisma.subject.findUnique({ where: { id: params.id }, include: { materials: true, tests: true } });
  if (!subject) return <div className="container mx-auto px-4 py-8">Mata pelajaran tidak ditemukan.</div>;
  const materialCount = subject.materials.length;
  const testCount = subject.tests.length;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Edit Mata Pelajaran</h1>
      <form action={updateSubject.bind(null, subject.id)} className="mt-4 grid gap-2">
        <div className="grid gap-2 md:grid-cols-3">
          <div>
            <label className="text-sm">Nama</label>
            <Input name="name" defaultValue={subject.name} required />
          </div>
          <div>
            <label className="text-sm">Tingkat/Kelas</label>
            <Input name="grade" defaultValue={subject.grade} required />
          </div>
          <div>
            <label className="text-sm">Deskripsi</label>
            <Input name="description" defaultValue={subject.description ?? ""} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit">Simpan</Button>
          <form action={deleteSubject.bind(null, subject.id)}>
            <Button type="submit" variant="outline" disabled={materialCount > 0 || testCount > 0}>
              Hapus (nonaktif jika masih dipakai)
            </Button>
          </form>
        </div>
        <p className="text-xs text-gray-500">Terkait: {materialCount} materi, {testCount} tryout.</p>
      </form>
    </main>
  );
}

async function updateSubject(id: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const grade = String(formData.get("grade") || "").trim();
  const description = String(formData.get("description") || "").trim() || undefined;
  if (!name || !grade) return;
  await prisma.subject.update({ where: { id }, data: { name, grade, description } });
  redirect("/admin/subjects");
}

async function deleteSubject(id: string) {
  "use server";
  const refCounts = await prisma.subject.findUnique({ where: { id }, include: { materials: true, tests: true } });
  if (refCounts && (refCounts.materials.length > 0 || refCounts.tests.length > 0)) {
    redirect(`/admin/subjects`);
  }
  await prisma.subject.delete({ where: { id } });
  redirect("/admin/subjects");
}

