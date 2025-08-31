"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  grade: z.string().min(1)
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Pendaftaran gagal");
        return;
      }
      router.replace("/auth/login?registered=1");
    });
  });

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Daftar Siswa</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div>
          <label className="text-sm">Nama</label>
          <Input placeholder="Nama lengkap" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">{String(errors.name.message)}</p>}
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600">{String(errors.email.message)}</p>}
        </div>
        <div>
          <label className="text-sm">Password</label>
          <Input type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-red-600">{String(errors.password.message)}</p>}
        </div>
        <div>
          <label className="text-sm">Kelas/Tingkat</label>
          <Input placeholder="Contoh: 9, 12, SBMPTN" {...register("grade")} />
          {errors.grade && <p className="text-xs text-red-600">{String(errors.grade.message)}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={isPending} type="submit">{isPending ? "Memproses..." : "Daftar"}</Button>
      </form>
      <p className="mt-4 text-sm">
        Sudah punya akun? <a className="underline" href="/auth/login">Masuk</a>
      </p>
    </div>
  );
}

