import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="relative overflow-hidden bg-gradient-to-b from-brand/10 to-transparent">
        <div className="container mx-auto px-4 py-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient">
              Bimbingan Belajar Brilliant
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tingkatkan prestasi belajar dengan materi terstruktur, latihan soal
              interaktif, dan tryout ber-timer. Mulai perjalanan belajar Anda hari ini.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center rounded-md bg-gradient-to-r from-brand to-indigo-500 px-5 py-2.5 text-white shadow-sm hover:opacity-90"
              >
                Daftar Siswa Baru
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center rounded-md border px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="relative h-[260px] md:h-[360px] lg:h-[420px] rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 isolate">
            <Image
              src="/hero-illustration.svg"
              alt="Ilustrasi belajar Brilliant"
              fill
              priority
              sizes="(min-width: 1024px) 600px, (min-width: 768px) 480px, 90vw"
              className="object-contain drop-shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold">Program Kami</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Pilih program sesuai tingkat dan kebutuhan belajar Anda.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Matematika Intensif", desc: "Konsep dasar hingga olimpiade." },
            { title: "Bahasa Indonesia", desc: "Pemahaman bacaan dan menulis." },
            { title: "IPA Terpadu", desc: "Fisika, Kimia, Biologi menyenangkan." },
          ].map((p) => (
            <div key={p.title} className="rounded-lg border p-5 hover:shadow-sm transition-shadow">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Testimoni Siswa</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-lg border p-5 bg-white dark:bg-gray-950">
                <p className="text-sm italic">“Materi jelas, latihan lengkap, dan progress terasa!”</p>
                <div className="mt-3 text-xs text-gray-500">— Siswa Brilliant</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold">Kontak & Lokasi</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <p>Email: info@brilliant-les.id</p>
            <p>
              Telepon: <a href="tel:+6285643721525" className="underline decoration-dotted hover:decoration-solid">+62 856-4372-1525</a>
            </p>
            <p>Alamat: 6FWX+5J Tlogo, Kabupaten Klaten, Jawa Tengah</p>
            <a
              className="mt-3 inline-flex text-sm text-brand hover:underline"
              href="https://www.google.com/maps/search/?api=1&query=LBB%20BRILLIANT"
              target="_blank"
              rel="noopener noreferrer"
            >Lihat di Google Maps</a>
          </div>
          <iframe
            title="Lokasi LBB BRILLIANT"
            className="w-full h-64 rounded-lg border"
            src="https://maps.google.com/maps?q=LBB%20BRILLIANT&t=&z=16&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </section>
    </main>
  );
}
