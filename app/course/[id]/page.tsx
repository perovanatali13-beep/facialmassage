import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { course } from "@/lib/course";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export function generateStaticParams() {
  return course.lessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = course.lessons.find((l) => l.id === id);
  return { title: lesson ? `${lesson.title} — курс самомассажа` : "Урок" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = course.lessons.find((l) => l.id === id);
  if (!lesson) notFound();

  const idx = course.lessons.findIndex((l) => l.id === lesson.id);
  const prev = course.lessons[idx - 1];
  const next = course.lessons[idx + 1];

  return (
    <>
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-5 py-14">
        <Link href="/course" className="text-sm text-terracotta hover:underline">
          ← Все уроки
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta font-display text-lg font-semibold text-white">
            {lesson.day}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-clay">
            День {lesson.day} · {lesson.category}
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold text-espresso md:text-4xl">
          {lesson.title}
        </h1>

        {lesson.videoUrl ? (
          <div className="mt-8 aspect-video overflow-hidden rounded-soft bg-black">
            <iframe
              src={lesson.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-8 flex aspect-video items-center justify-center rounded-soft bg-gradient-to-br from-sand to-clay/40 text-mocha">
            🎬 Видео урока появится здесь
          </div>
        )}

        <div
          className="prose-course mt-8"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        <div className="mt-12 flex justify-between gap-4 border-t border-sand pt-6 text-sm">
          {prev ? (
            <Link href={`/course/${prev.id}`} className="text-terracotta hover:underline">
              ← День {prev.day}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/course/${next.id}`} className="text-terracotta hover:underline">
              День {next.day} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </article>

      <SiteFooter />
    </>
  );
}
