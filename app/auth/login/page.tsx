"use client";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(params.get("error"));
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", { ...values, redirect: false });
      if (res?.error) {
        setError("Email atau password salah");
        return;
      }
      router.replace("/dashboard");
    });
  });

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Masuk</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={isPending} type="submit">{isPending ? "Memproses..." : "Masuk"}</Button>
      </form>
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-4">
          <button
            onClick={async () => {
              const res = await fetch("/api/dev/bootstrap-admin", { method: "POST" });
              if (res.ok) {
                alert("Admin default siap. Email: admin@brilliant-les.id / Password: admin123");
              } else {
                alert("Gagal membuat admin (dev-only)");
              }
            }}
            className="mt-2 h-9 px-4 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
            type="button"
          >Buat Admin Default (Dev)</button>
        </div>
      )}
      <p className="mt-4 text-sm">
        Belum punya akun? <a className="underline" href="/auth/register">Daftar</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}