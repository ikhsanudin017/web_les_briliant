import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/rbac";

export default async function ProfilePage() {
  await requireRole(["STUDENT", "ADMIN"]);
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { studentProfile: true } });
  if (!user) return null;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <form action={updateProfile.bind(null, userId)} className="mt-4 grid gap-3 max-w-xl">
        <div>
          <label className="text-sm">Nama</label>
          <Input name="name" defaultValue={user.name} />
        </div>
        <div>
          <label className="text-sm">Telepon</label>
          <Input name="phoneNumber" defaultValue={user.studentProfile?.phoneNumber || ""} />
        </div>
        <div>
          <label className="text-sm">Alamat</label>
          <Input name="address" defaultValue={user.studentProfile?.address || ""} />
        </div>
        <div>
          <label className="text-sm">Kelas/Tingkat</label>
          <Input name="grade" defaultValue={user.studentProfile?.grade || ""} />
        </div>
        <div>
          <label className="text-sm">Sekolah</label>
          <Input name="school" defaultValue={user.studentProfile?.school || ""} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Nama Orang Tua</label>
            <Input name="parentName" defaultValue={user.studentProfile?.parentName || ""} />
          </div>
          <div>
            <label className="text-sm">Telepon Orang Tua</label>
            <Input name="parentPhone" defaultValue={user.studentProfile?.parentPhone || ""} />
          </div>
        </div>
        <Button type="submit">Simpan</Button>
      </form>
    </main>
  );
}

async function updateProfile(userId: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim() || undefined;
  const address = String(formData.get("address") || "").trim() || undefined;
  const grade = String(formData.get("grade") || "").trim() || undefined;
  const school = String(formData.get("school") || "").trim() || undefined;
  const parentName = String(formData.get("parentName") || "").trim() || undefined;
  const parentPhone = String(formData.get("parentPhone") || "").trim() || undefined;

  if (name) {
    await prisma.user.update({ where: { id: userId }, data: { name } });
  }
  await prisma.studentProfile.upsert({
    where: { userId },
    update: { phoneNumber, address, grade: grade ?? "", school, parentName, parentPhone },
    create: { userId, grade: grade ?? "" }
  });
}

