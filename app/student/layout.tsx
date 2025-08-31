import { ReactNode } from "react";
import { requireRole } from "@/lib/rbac";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireRole(["ADMIN", "STUDENT"]);
  return (
    <>
      <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-student/15 to-emerald-400/10 dark:from-student/20 dark:to-emerald-500/10 backdrop-blur">
        <div className="container mx-auto px-4 h-10 flex items-center justify-between text-sm">
          <div className="font-medium text-student">Area Siswa</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Materi, Tryout, Nilai</div>
        </div>
      </div>
      {children}
    </>
  );
}
