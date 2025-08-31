import { promises as fs } from "fs";
import path from "path";

function sanitizeName(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$|\.+$/g, "");
  return base || `file`;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function savePublicFile(file: File, subdir = "uploads") {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = sanitizeName(file.name || `file`);
  const ext = path.extname(name) || ".bin";
  const stamp = Date.now().toString(36);
  const finalName = `${path.basename(name, ext)}-${stamp}${ext}`;
  const publicDir = path.join(process.cwd(), "public", subdir);
  await ensureDir(publicDir);
  const absPath = path.join(publicDir, finalName);
  await fs.writeFile(absPath, buf);
  const relPath = `/${subdir}/${finalName}`;
  return { relPath, absPath };
}

export async function listPublicFiles(subdir = "uploads") {
  const dir = path.join(process.cwd(), "public", subdir);
  try {
    const entries = await fs.readdir(dir);
    return entries.map((n) => `/${subdir}/${n}`);
  } catch {
    return [];
  }
}

export async function deletePublicFile(relPath: string) {
  // Only allow deleting inside /public
  if (!relPath.startsWith("/")) return false;
  const abs = path.join(process.cwd(), "public", relPath.replace(/^\//, ""));
  try {
    await fs.unlink(abs);
    return true;
  } catch {
    return false;
  }
}

