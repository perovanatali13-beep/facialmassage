import Link from "next/link";
import type { Metadata } from "next";
import { course } from "@/lib/course";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CourseLogout from "../components/CourseLogout";

export const metadata: Metadata = {
  title: "Курс самомассажа лица — уроки",
  description: "7-дневный экспресс-курс по самомассажу лица: уроки по дням.",
};

export default function CoursePage() {
  const lessons = course.lessons;

  return (
    <>
      <SiteHeader />

      <section className="bg-sand/40 py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
            7 дней практики
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold text-espresso md:text-5xl">
            {course.intro.title}
          </h1>
          <p className="mt-4 font-display text-xl italic text-terracotta">
            «{course.intro.tagline}»
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-5">
          <div className="rounded-soft border border-sand bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-espresso">
              Инструкция к курсу
            </h2>
            <p className="mt-2 text-mocha">{course.intro.instruction}</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-3xl space-y-4 px-5">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/course/${lesson.id}`}
              className="flex items-start gap-5 rounded-soft border border-sand bg-white p-6 transition hover:border-terracotta hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-terracotta font-display text-xl font-semibold text-white">
                {lesson.day}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-clay">
                  {lesson.category}
                </span>
                <h3 className="font-display text-xl font-semibold text-espresso">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-mocha">{lesson.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Переход к тесту на тип кожи — после самого курса */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="rounded-soft bg-espresso px-6 py-10 text-center text-cream shadow-sm sm:px-10">
            <p className="text-sm font-medium uppercase tracking-wide text-rose">
              Бонус к курсу
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              Определите свой тип кожи
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/80">
              Пройдите анкету по классификации Лесли Бауманн — узнайте свой тип кожи
              и получите персональные рекомендации по уходу.
            </p>
            <Link
              href="/course/test"
              className="mt-7 inline-block rounded-full bg-terracotta px-8 py-3 font-medium text-white transition hover:bg-clay"
            >
              Пройти тест на тип кожи
            </Link>
          </div>

          <div className="mt-8 text-center">
            <CourseLogout />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
