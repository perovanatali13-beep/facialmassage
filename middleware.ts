import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, signAccessToken, safeEqual } from "@/lib/courseAuth";

// Защищаем страницы курса и видеофайлы. Лендинг и API остаются открытыми.
export const config = {
  matcher: ["/course/:path*", "/lessons/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Страница ввода пароля доступна без авторизации
  if (pathname === "/course/access") return NextResponse.next();

  const secret = process.env.COURSE_SECRET || "";
  const cookie = req.cookies.get(COOKIE_NAME)?.value || "";
  const expected = secret ? await signAccessToken(secret) : "";

  if (secret && expected && safeEqual(cookie, expected)) {
    return NextResponse.next();
  }

  // Видеофайлы — закрываем без редиректа, чтобы не ломать плеер
  if (pathname.startsWith("/lessons/")) {
    return new NextResponse("Доступ к курсу закрыт", { status: 401 });
  }

  // Страницы курса — отправляем на ввод пароля
  const url = req.nextUrl.clone();
  url.pathname = "/course/access";
  url.search = "";
  return NextResponse.redirect(url);
}
