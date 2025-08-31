import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { savePublicFile } from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function MaterialsPage() {
  await requireRole(["ADMIN"]);
  const [subjects, materials] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.material.findMany({ orderBy: { createdAt: "desc" }, include: { subject: true } }),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Kelola Materi</h1>
      <form action={createMaterial} className="mt-4 grid gap-2" encType="multipart/form-data">
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
        <div>
          <label className="text-sm">Deskripsi</label>
          <Textarea name="description" />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Upload File</label>
            <input name="file" type="file" accept=".pdf,video/*,image/*" className="text-sm" />
            <p className="text-xs text-gray-500">Atau isi URL manual di bawah.</p>
          </div>
          <div>
            <label className="text-sm">URL File (opsional)</label>
            <Input name="fileUrl" placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-sm">Tipe File</label>
          <Input name="fileType" placeholder="pdf/video/image" required />
        </div>
        <Button type="submit">Tambah Materi</Button>
        <p className="text-xs text-gray-500">Catatan: Jika Anda mengunggah file, URL akan diisi otomatis ke folder lokal /uploads.</p>
      </form>

      <div className="mt-8 grid gap-3">
        {materials.map(m => (
          <div key={m.id} className="rounded-md border p-3">
            <div className="font-medium">{m.title} <span className="text-xs text-gray-500">({m.fileType})</span></div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{m.subject.name} - {m.subject.grade}</div>
            <a className="text-sm underline" href={m.fileUrl} target="_blank">Buka file</a>
            <div className="mt-2">
              <a className="text-sm rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-900" href={`/admin/materials/${m.id}`}>Edit</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

async function createMaterial(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const subjectId = String(formData.get("subjectId") || "").trim();
  const description = String(formData.get("description") || "").trim() || undefined;
  const fileFromForm = formData.get("file") as File | null;
  let fileUrl = String(formData.get("fileUrl") || "").trim();
  const fileType = String(formData.get("fileType") || "").trim();
  if (!title || !subjectId || !fileType) return;

  if (fileFromForm && fileFromForm.size > 0) {
    const { relPath } = await savePublicFile(fileFromForm, "uploads");
    fileUrl = relPath;
  }
  if (!fileUrl) return;
  await prisma.material.create({ data: { title, subjectId, description, fileUrl, fileType } });
}
