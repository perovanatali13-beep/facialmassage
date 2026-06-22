import { NextResponse } from "next/server";
import { COOKIE_NAME, signAccessToken, safeEqual } from "@/lib/courseAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const real = process.env.COURSE_PASSWORD || "";
  const secret = process.env.COURSE_SECRET || "";
  if (!real || !secret) {
    return NextResponse.json(
      { error: "Доступ к курсу ещё не настроен" },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !safeEqual(password, real)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await signAccessToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 180 дней
  });
  return res;
}
