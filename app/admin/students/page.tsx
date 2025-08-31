import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentsPage({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  await requireRole(["ADMIN"]);
  const q = (searchParams.q as string) || "";
  const page = Number(searchParams.page || 1);
  const pageSize = Number(searchParams.pageSize || 10);

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        OR: q ? [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ] : undefined,
      },
      include: { studentProfile: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: { role: "STUDENT", OR: q ? [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ] : undefined } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kelola Siswa</h1>
        <Link href={`/api/admin/students/export?q=${encodeURIComponent(q)}`} className="text-sm underline">Export CSV</Link>
      </div>
      <form className="mt-4">
        <Input name="q" placeholder="Cari nama/email" defaultValue={q} />
      </form>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-left">
            <tr>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Kelas</th>
              <th className="px-3 py-2">Terdaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((s) => (
              <tr key={s.id}>
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.email}</td>
                <td className="px-3 py-2">{s.studentProfile?.grade ?? '-'}</td>
                <td className="px-3 py-2">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div>Total: {total}</div>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <a key={i} className={`px-2 py-1 rounded border ${i+1===page? 'bg-gray-100 dark:bg-gray-900':''}`} href={`?q=${encodeURIComponent(q)}&page=${i+1}&pageSize=${pageSize}`}>{i+1}</a>
          ))}
        </div>
      </div>
    </main>
  );
}
