import { course } from "@/lib/course";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Стримит приватное видео урока из Vercel Blob.
 * Файл лежит в приватном Blob-сторе и недоступен по прямой ссылке — сервер
 * запрашивает его с токеном и проксирует поток клиенту, прокидывая Range
 * (для перемотки). Наружу прямой URL файла не отдаётся, поэтому скачать
 * видео по ссылке нельзя.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lesson = course.lessons.find((l) => l.id === id);
  if (!lesson?.videoFile) {
    return new Response("Not found", { status: 404 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response("Storage is not configured", { status: 500 });
  }

  const range = req.headers.get("range");
  const upstream = await fetch(lesson.videoFile, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(range ? { Range: range } : {}),
    },
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = lesson.videoFile.toLowerCase().endsWith(".mov")
    ? "video/quicktime"
    : "video/mp4";

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Accept-Ranges", "bytes");
  // inline + no-store: воспроизведение в плеере, без явной выгрузки файла
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, { status: upstream.status, headers });
}
