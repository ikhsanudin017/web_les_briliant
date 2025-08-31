import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function TestSettingsPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const test = await prisma.test.findUnique({ where: { id: params.id }, include: { subject: true, questions: true } });
  if (!test) return <div className="container mx-auto px-4 py-8">Tryout tidak ditemukan.</div>;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Pengaturan Tryout</h1>
      <div className="text-sm text-gray-600 dark:text-gray-300">Mapel: {test.subject.name} ({test.subject.grade}) • {test.questions.length} soal</div>

      <form action={updateTest.bind(null, test.id)} className="mt-4 grid gap-2">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Judul</label>
            <Input name="title" defaultValue={test.title} required />
          </div>
          <div>
            <label className="text-sm">Durasi (menit)</label>
            <Input type="number" min={1} name="duration" defaultValue={test.duration} required />
          </div>
        </div>
        <div>
          <label className="text-sm">Deskripsi</label>
          <Input name="description" defaultValue={test.description ?? ""} />
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={test.isActive} /> Aktifkan tryout
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit">Simpan</Button>
          <form action={deleteTest.bind(null, test.id)}>
            <Button type="submit" variant="outline">Hapus Tryout</Button>
          </form>
        </div>
      </form>

      <div className="mt-6">
        <a href={`/admin/tests/${test.id}`} className="text-sm underline">Kembali ke Kelola Soal</a>
      </div>
    </main>
  );
}

async function updateTest(id: string, formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const duration = Number(formData.get("duration") || 0);
  const description = String(formData.get("description") || "").trim() || undefined;
  const isActive = Boolean(formData.get("isActive"));
  if (!title || !duration) return;
  await prisma.test.update({ where: { id }, data: { title, duration, description, isActive } });
  redirect(`/admin/tests/${id}/settings`);
}

async function deleteTest(id: string) {
  "use server";
  await prisma.test.delete({ where: { id } });
  redirect("/admin/tests");
}

