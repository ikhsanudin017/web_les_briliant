import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { savePublicFile, deletePublicFile } from "@/lib/upload";
import { redirect } from "next/navigation";

export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const material = await prisma.material.findUnique({ where: { id: params.id }, include: { subject: true } });
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  if (!material) return <div className="container mx-auto px-4 py-8">Materi tidak ditemukan.</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Edit Materi</h1>
      <form action={updateMaterial.bind(null, material.id)} className="mt-4 grid gap-2" encType="multipart/form-data">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Judul</label>
            <Input name="title" defaultValue={material.title} required />
          </div>
          <div>
            <label className="text-sm">Mata Pelajaran</label>
            <select className="h-9 w-full rounded-md border px-3 text-sm" name="subjectId" defaultValue={material.subjectId} required>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm">Deskripsi</label>
          <Textarea name="description" defaultValue={material.description ?? ""} />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-sm">Upload File (opsional)</label>
            <input name="file" type="file" accept=".pdf,video/*,image/*" className="text-sm" />
            <p className="text-xs text-gray-500">Jika memilih file baru, URL akan diganti.</p>
          </div>
          <div>
            <label className="text-sm">URL File</label>
            <Input name="fileUrl" defaultValue={material.fileUrl} />
          </div>
        </div>
        <div>
          <label className="text-sm">Tipe File</label>
          <Input name="fileType" defaultValue={material.fileType} required />
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit">Simpan</Button>
          <form action={deleteMaterial.bind(null, material.id, material.fileUrl)}>
            <Button type="submit" variant="outline">Hapus Materi</Button>
          </form>
        </div>
      </form>
    </main>
  );
}

async function updateMaterial(id: string, formData: FormData) {
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
  await prisma.material.update({ where: { id }, data: { title, subjectId, description, fileUrl, fileType } });
  redirect("/admin/materials");
}

async function deleteMaterial(id: string, currentUrl: string) {
  "use server";
  await prisma.material.delete({ where: { id } });
  if (currentUrl?.startsWith("/uploads/")) {
    await deletePublicFile(currentUrl);
  }
  redirect("/admin/materials");
}

