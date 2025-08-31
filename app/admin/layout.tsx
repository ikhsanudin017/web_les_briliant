import { ReactNode } from "react";
import { requireRole } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole(["ADMIN"]);
  return (
    <>
      <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-admin/20 to-rose-400/10 dark:from-admin/25 dark:to-rose-500/10 backdrop-blur">
        <div className="container mx-auto px-4 h-10 flex items-center justify-between text-sm">
          <div className="font-medium text-admin">Panel Admin</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Hanya admin yang dapat mengakses</div>
        </div>
      </div>
      {children}
    </>
  );
}
