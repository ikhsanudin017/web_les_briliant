import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ResultsPage() {
  await requireRole(["STUDENT", "ADMIN"]);
  const session = await getServerSession(authOptions);
  const results = await prisma.testResult.findMany({ where: { userId: session!.user.id }, include: { test: true }, orderBy: { completedAt: "desc" } });
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Riwayat Nilai</h1>
      <div className="mt-6 grid gap-3">
        {results.map(r => (
          <a href={`/student/results/${r.id}`} key={r.id} className="rounded-md border p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900">
            <div>
              <div className="font-medium">{r.test.title}</div>
              <div className="text-xs text-gray-500">{new Date(r.completedAt).toLocaleString()}</div>
            </div>
            <div className="text-xl font-bold">{r.score.toFixed(1)}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
