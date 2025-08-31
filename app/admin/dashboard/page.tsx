import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole(["ADMIN"]);
  const [students, materials, tests] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.material.count(),
    prisma.test.count(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Siswa aktif</div><div className="text-2xl font-bold">{students}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Materi</div><div className="text-2xl font-bold">{materials}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Tryout</div><div className="text-2xl font-bold">{tests}</div></div>
      </div>
    </main>
  );
}

