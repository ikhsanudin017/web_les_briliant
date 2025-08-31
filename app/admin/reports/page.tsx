import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  await requireRole(["ADMIN"]);
  const results = await prisma.testResult.findMany({ include: { test: { include: { subject: true } } } });
  const bySubject = new Map<string, { name: string; sum: number; count: number }>();
  for (const r of results) {
    const key = `${r.test.subject.id}`;
    const stat = bySubject.get(key) || { name: `${r.test.subject.name} (${r.test.subject.grade})`, sum: 0, count: 0 };
    stat.sum += r.score; stat.count += 1; bySubject.set(key, stat);
  }
  const stats = Array.from(bySubject.values()).map(s => ({ name: s.name, avg: s.count ? s.sum / s.count : 0 }));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Laporan & Analytics</h1>
      <div className="mt-6 grid gap-3">
        {stats.length === 0 && <div className="text-sm text-gray-500">Belum ada data.</div>}
        {stats.map(s => (
          <div key={s.name} className="rounded-md border p-3 flex items-center justify-between">
            <div className="font-medium">{s.name}</div>
            <div className="text-xl font-bold">{s.avg.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

