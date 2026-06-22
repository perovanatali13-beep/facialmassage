"use client";

import { useState } from "react";
import { sections, computeResult, totalQuestions, type TestResult } from "@/lib/skinTest";

export default function SkinTest() {
  // choices: ключ "<sectionKey>-<qIndex>" -> индекс выбранного варианта
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(choices).length;

  function pick(key: string, optionIndex: number) {
    setChoices((c) => ({ ...c, [key]: optionIndex }));
    setError("");
  }

  function submit() {
    if (answeredCount < totalQuestions) {
      setError(`Ответьте на все вопросы. Осталось: ${totalQuestions - answeredCount}.`);
      document
        .querySelector("[data-unanswered='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Переводим индексы вариантов в баллы
    const scores: Record<string, number> = {};
    sections.forEach((s) => {
      s.questions.forEach((question, qi) => {
        const key = `${s.key}-${qi}`;
        scores[key] = question.opts[choices[key]][1];
      });
    });
    setResult(computeResult(scores));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setChoices({});
    setResult(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

          <div className="mt-6 rounded-xl bg-sand/40 p-4 text-sm text-mocha">
            <p className="font-medium text-espresso">Как набрались баллы:</p>
            <ul className="mt-2 space-y-1">
              {result.parts.map((p) => (
                <li key={p.key}>
                  {p.title} — {Math.round(p.score * 10) / 10} → <b>{p.letter}</b>
                </li>
              ))}
            </ul>
          </div>
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

  let qNo = 0;
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <a href="/course" className="text-sm text-terracotta hover:underline">
        ← Все уроки
      </a>
      <h1 className="mt-6 font-display text-3xl font-semibold text-espresso md:text-4xl">
        Тест: определите свой тип кожи
      </h1>
      <p className="mt-3 text-mocha">
        Анкета по классификации Лесли Бауманн. Отвечайте честно, ориентируясь на
        ощущения. В конце вы получите свой тип кожи и рекомендации по уходу.
      </p>

      {sections.map((s) => (
        <section key={s.key} className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-terracotta">{s.title}</h2>
          <p className="mt-1 text-sm text-mocha">{s.intro}</p>

          <div className="mt-6 space-y-6">
            {s.questions.map((question, qi) => {
              qNo += 1;
              const key = `${s.key}-${qi}`;
              const chosen = choices[key];
              const unanswered = chosen === undefined;
              return (
                <div
                  key={key}
                  data-unanswered={unanswered ? "true" : "false"}
                  className="rounded-soft border border-sand bg-white p-5"
                >
                  <p className="font-medium text-espresso">
                    <span className="text-clay">{qNo}.</span> {question.q}
                  </p>
                  <div className="mt-3 space-y-2">
                    {question.opts.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                          chosen === oi
                            ? "border-terracotta bg-sand/50 text-espresso"
                            : "border-sand text-mocha hover:border-clay"
                        }`}
                      >
                        <input
                          type="radio"
                          name={key}
                          className="mt-1 accent-terracotta"
                          checked={chosen === oi}
                          onChange={() => pick(key, oi)}
                        />
                        <span>{opt[0]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {error && (
        <p className="mt-8 rounded-xl bg-rose/20 px-4 py-3 text-center text-sm text-terracotta">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-mocha">
          Отвечено: {answeredCount} из {totalQuestions}
        </span>
        <button
          onClick={submit}
          className="rounded-full bg-terracotta px-8 py-3 font-medium text-white transition hover:bg-clay"
        >
          Показать результат
        </button>
      </div>
    </div>
  );
}
