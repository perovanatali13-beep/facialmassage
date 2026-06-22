"use client";

import { useMemo, useState } from "react";
import { sections, computeResult, type TestResult } from "@/lib/skinTest";

export default function SkinTest() {
  // Разворачиваем все вопросы в один линейный список (по одному на экран)
  const flat = useMemo(
    () =>
      sections.flatMap((s) =>
        s.questions.map((q, qi) => ({
          sectionKey: s.key,
          sectionTitle: s.title,
          key: `${s.key}-${qi}`,
          q,
        }))
      ),
    []
  );
  const total = flat.length;

  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);

  const current = flat[step];
  const currentChosen = choices[current?.key];
  const answered = currentChosen !== undefined;
  const isLast = step === total - 1;
  const sectionIdx = sections.findIndex((s) => s.key === current?.sectionKey);

  function pick(optionIndex: number) {
    setChoices((c) => ({ ...c, [current.key]: optionIndex }));
  }

  function next() {
    if (!answered) return;
    if (isLast) {
      const scores: Record<string, number> = {};
      sections.forEach((s) => {
        s.questions.forEach((question, qi) => {
          const key = `${s.key}-${qi}`;
          scores[key] = question.opts[choices[key]][1];
        });
      });
      setResult(computeResult(scores));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    if (step === 0) return;
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setChoices({});
    setResult(null);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Результат ──
  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="rounded-soft border border-sand bg-white p-7 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-terracotta">
            Ваш тип кожи
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-espresso">
            {result.code}
          </h1>
          {result.info ? (
            <>
              <p className="mt-3 font-display text-xl text-terracotta">
                {result.info.title}
              </p>
              <p className="mt-4 text-mocha">{result.info.summary}</p>
              <h2 className="mt-7 font-display text-lg font-semibold text-espresso">
                Рекомендации по уходу
              </h2>
              <ul className="mt-3 space-y-2">
                {result.info.recs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-mocha">
                    <span className="mt-1 text-terracotta">✦</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-mocha">Описание для этого типа кожи скоро появится.</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay"
          >
            Пройти заново
          </button>
          <a
            href="/course"
            className="rounded-full border border-clay px-6 py-3 font-medium text-espresso transition hover:bg-sand"
          >
            Вернуться к курсу
          </a>
        </div>

        <p className="mt-6 text-xs text-mocha">
          Результат носит рекомендательный характер и не заменяет консультацию
          врача-дерматолога.
        </p>
      </div>
    );
  }

  // ── Один вопрос на экран ──
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      {/* Таймлайн по 4 секциям */}
      <div className="flex gap-2">
        {sections.map((s, i) => (
          <div key={s.key} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i < sectionIdx
                  ? "bg-terracotta"
                  : i === sectionIdx
                  ? "bg-terracotta/40"
                  : "bg-sand"
              }`}
            >
              {i === sectionIdx && (
                <div
                  className="h-1.5 rounded-full bg-terracotta transition-all"
                  style={{
                    width: `${
                      ((sectionStepIndex(flat, step)) /
                        sectionCount(sections, s.key)) *
                      100
                    }%`,
                  }}
                />
              )}
            </div>
            <p
              className={`mt-2 hidden text-[0.7rem] leading-tight sm:block ${
                i === sectionIdx ? "text-terracotta" : "text-mocha"
              }`}
            >
              {s.title}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-clay">
        {current.sectionTitle} · вопрос {step + 1} из {total}
      </p>

      <h1 className="mt-3 font-display text-2xl font-semibold leading-snug text-espresso md:text-3xl">
        {current.q.q}
      </h1>

      <div className="mt-7 space-y-3">
        {current.q.opts.map((opt, oi) => (
          <button
            key={oi}
            onClick={() => pick(oi)}
            className={`flex w-full items-center gap-3 rounded-soft border px-5 py-4 text-left transition ${
              currentChosen === oi
                ? "border-terracotta bg-sand/50 text-espresso"
                : "border-sand bg-white text-mocha hover:border-clay"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                currentChosen === oi
                  ? "border-terracotta bg-terracotta text-white"
                  : "border-clay"
              }`}
            >
              {currentChosen === oi && <span className="text-xs">✓</span>}
            </span>
            <span>{opt[0]}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className="rounded-full border border-clay px-6 py-3 font-medium text-espresso transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Назад
        </button>
        <button
          onClick={next}
          disabled={!answered}
          className="rounded-full bg-terracotta px-9 py-3 font-medium text-white transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLast ? "Показать результат" : "Далее"}
        </button>
      </div>
    </div>
  );
}

// Сколько вопросов в секции
function sectionCount(secs: typeof sections, key: string) {
  const s = secs.find((x) => x.key === key);
  return s ? s.questions.length : 1;
}

// Индекс текущего вопроса внутри его секции (0-based) + 1 для прогресса
function sectionStepIndex(
  flat: { sectionKey: string }[],
  step: number
): number {
  const key = flat[step].sectionKey;
  let idx = 0;
  for (let i = 0; i <= step; i++) {
    if (flat[i].sectionKey === key) idx++;
  }
  return idx;
}
