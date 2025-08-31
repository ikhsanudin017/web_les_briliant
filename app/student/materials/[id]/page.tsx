import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export default async function MaterialDetail({ params }: { params: { id: string } }) {
  await requireRole(["STUDENT", "ADMIN"]);
  const material = await prisma.material.findUnique({ where: { id: params.id }, include: { subject: true } });
  if (!material) return <div className="container mx-auto px-4 py-8">Materi tidak ditemukan</div>;
  const isPdf = material.fileType.toLowerCase().includes("pdf");
  const isVideo = material.fileType.toLowerCase().includes("video") || material.fileUrl.includes("youtube.com");
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500">{material.subject.name} • {material.subject.grade}</div>
      <h1 className="text-2xl font-semibold">{material.title}</h1>
      {material.description && <p className="mt-2 text-gray-600 dark:text-gray-300">{material.description}</p>}

      <div className="mt-6">
        {isPdf ? (
          <iframe className="w-full h-[70vh] rounded-md border" src={material.fileUrl} />
        ) : isVideo ? (
          <video className="w-full rounded-md border" controls src={material.fileUrl} />
        ) : (
          <a className="underline" href={material.fileUrl} target="_blank">Unduh / Buka Materi</a>
        )}
      </div>
    </main>
  );
}

