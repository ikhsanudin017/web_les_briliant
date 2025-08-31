import { requireRole } from "@/lib/rbac";
import { listPublicFiles, savePublicFile, deletePublicFile } from "@/lib/upload";

export default async function GalleryAdminPage() {
  await requireRole(["ADMIN"]);
  const images = await listPublicFiles("gallery");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Kelola Galeri</h1>
      <form action={uploadImages} className="mt-4 grid gap-2" encType="multipart/form-data">
        <div>
          <label className="text-sm">Unggah Gambar</label>
          <input name="files" type="file" multiple accept="image/*" className="text-sm" />
          <p className="text-xs text-gray-500">Format: JPG/PNG/SVG. Disimpan ke folder lokal /public/gallery.</p>
        </div>
        <button className="h-9 px-4 rounded-md bg-brand text-white hover:opacity-90" type="submit">Unggah</button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src) => (
          <div key={src} className="rounded-lg border p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Foto galeri" className="w-full h-48 object-cover rounded-md" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 break-all">{src}</span>
              <form action={removeImage.bind(null, src)}>
                <button className="text-sm rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-900" type="submit">Hapus</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

async function uploadImages(formData: FormData) {
  "use server";
  const files = formData.getAll("files") as File[];
  if (!files?.length) return;
  await Promise.all(
    files.filter((f) => f.size > 0).map((f) => savePublicFile(f, "gallery"))
  );
}

async function removeImage(relPath: string) {
  "use server";
  await deletePublicFile(relPath);
}

