import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StudentDashboard() {
  await requireRole(["STUDENT", "ADMIN"]); // allow ADMIN to preview
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [materialsCount, testsCount, results] = await Promise.all([
    prisma.material.count(),
    prisma.test.count({ where: { isActive: true } }),
    prisma.testResult.findMany({ where: { userId }, orderBy: { completedAt: "desc" }, take: 5, include: { test: true } })
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Halo, {session?.user?.name}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Materi tersedia</div><div className="text-2xl font-bold">{materialsCount}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Tryout aktif</div><div className="text-2xl font-bold">{testsCount}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-gray-500">Nilai rata-rata</div><div className="text-2xl font-bold">{avg(results.map(r=>r.score)).toFixed(1)}</div></div>
      </div>
      <div className="mt-8">
        <h2 className="font-semibold">Riwayat Nilai Terbaru</h2>
        <div className="mt-3 grid gap-3">
          {results.length === 0 && <div className="text-sm text-gray-500">Belum ada hasil.</div>}
          {results.map(r => (
            <div key={r.id} className="rounded-md border p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.test.title}</div>
                <div className="text-xs text-gray-500">{new Date(r.completedAt).toLocaleString()}</div>
              </div>
              <div className="text-xl font-bold">{r.score}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function avg(ns: number[]) { return ns.length ? ns.reduce((a,b)=>a+b,0)/ns.length : 0; }

