"use client";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";

type Question = {
  id: string;
  question: string;
  optionA: string; optionB: string; optionC: string; optionD: string;
};

type Props = {
  testId: string;
  duration: number; // minutes
  questions: Question[];
};

type AnswerMap = Record<string, "A" | "B" | "C" | "D" | undefined>;

export default function TestRunner({ testId, duration, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [bookmarks, toggleBookmark] = useReducer((s: Record<string, boolean>, id: string) => ({ ...s, [id]: !s[id] }), {});
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitting, setSubmitting] = useState(false);
  const current = questions[index];

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit();
    }
  }, [timeLeft]);

  function onSelect(ans: "A" | "B" | "C" | "D") {
    setAnswers((a) => ({ ...a, [current.id]: ans }));
  }

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/student/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId, answers })
    });
    if (res.ok) {
      window.location.href = "/student/results";
    } else {
      alert("Gagal menyimpan hasil.");
      setSubmitting(false);
    }
  }

  const mins = Math.max(0, Math.floor(timeLeft / 60));
  const secs = Math.max(0, timeLeft % 60);
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">Soal {index + 1} / {questions.length}</div>
          <div className="text-sm font-medium">Waktu: {mins}:{secs.toString().padStart(2, "0")}</div>
        </div>
        <div className="mt-4 text-lg font-medium">{current.question}</div>
        <div className="mt-4 grid gap-2">
          {(["A","B","C","D"] as const).map((k) => (
            <label key={k} className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer ${answers[current.id]===k? 'bg-brand/10 border-brand' : ''}`}>
              <input type="radio" name={current.id} checked={answers[current.id]===k} onChange={() => onSelect(k)} />
              <span className="font-medium w-5">{k}.</span>
              <span>{current[`option${k}` as const]}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" onClick={() => setIndex((i) => Math.max(0, i-1))} disabled={index === 0}>Sebelumnya</Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toggleBookmark(current.id)}>{bookmarks[current.id] ? "Hapus bookmark" : "Bookmark"}</Button>
            {index < questions.length - 1 ? (
              <Button onClick={() => setIndex((i) => Math.min(questions.length - 1, i+1))}>Berikutnya</Button>
            ) : (
              <Button onClick={onSubmit} disabled={submitting}>{submitting? 'Menyimpan...' : 'Selesai & Simpan'}</Button>
            )}
          </div>
        </div>
      </div>
      <aside className="rounded-lg border p-4">
        <div className="text-sm">Progress: {progress}%</div>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              className={`h-8 rounded-md border text-xs ${i===index? 'bg-gray-100 dark:bg-gray-900':''} ${answers[q.id]? 'border-brand':''} ${bookmarks[q.id]? 'ring-1 ring-yellow-500':''}`}
              onClick={() => setIndex(i)}
            >{i+1}</button>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">Tombol biru: sudah dijawab. Lingkaran kuning: dibookmark.</div>
      </aside>
    </div>
  );
}

