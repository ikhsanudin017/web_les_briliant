"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/student") || pathname === "/dashboard";

  return (
    <header className="h-16 sticky top-0 z-50 border-b border-white/20 dark:border-gray-800 bg-white/60 dark:bg-gray-950/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Beranda Brilliant">
            <Image src="/logo.jpg" alt="Logo Brilliant LES" width={28} height={28} className="rounded-sm shadow-sm" />
            <span className="font-semibold tracking-tight bg-gradient-to-r from-brand to-indigo-500 bg-clip-text text-transparent group-hover:opacity-90">
              Brilliant LES
            </span>
          </Link>
          {isDashboard && (
            <nav className="hidden md:flex items-center gap-4 text-sm">
              {session?.user?.role === "ADMIN" ? (
                <>
                  <Link className="hover:text-admin transition-colors" href="/admin/dashboard">Dashboard</Link>
                  <Link className="hover:text-admin transition-colors" href="/admin/students">Siswa</Link>
                  <Link className="hover:text-admin transition-colors" href="/admin/materials">Materi</Link>
                  <Link className="hover:text-admin transition-colors" href="/admin/tests">Tryout</Link>
                  <Link className="hover:text-admin transition-colors" href="/admin/gallery">Galeri</Link>
                  <Link className="hover:text-admin transition-colors" href="/admin/reports">Laporan</Link>
                </>
              ) : (
                <>
                  <Link className="hover:text-student transition-colors" href="/student/dashboard">Dashboard</Link>
                  <Link className="hover:text-student transition-colors" href="/student/materials">Materi</Link>
                  <Link className="hover:text-student transition-colors" href="/student/tests">Tryout</Link>
                  <Link className="hover:text-student transition-colors" href="/student/results">Nilai</Link>
                </>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {session ? (
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              onClick={() => signOut({ callbackUrl: "/" })}
            >Keluar</button>
          ) : (
            <Link href="/auth/login" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">Masuk</Link>
          )}
        </div>
      </div>
    </header>
  );
}
