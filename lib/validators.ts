import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().max(200).optional().default(""),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  grade: z.string().min(1),
});

export const subjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  grade: z.string().min(1),
});

export const materialSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileType: z.enum(["pdf", "video", "image", "other"]).or(z.string().min(2)),
  subjectId: z.string().min(1),
});

export const testSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  duration: z.coerce.number().int().min(1),
  subjectId: z.string().min(1),
  isActive: z.coerce.boolean().optional().default(true),
});

export const questionSchema = z.object({
  testId: z.string().min(1),
  question: z.string().min(4),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctAnswer: z.enum(["A", "B", "C", "D"]).or(z.string().min(1)),
  explanation: z.string().optional(),
});

export const resultSchema = z.object({
  testId: z.string().min(1),
  answers: z.record(z.string(), z.string()).or(z.any()),
  score: z.number().min(0).max(100),
});

