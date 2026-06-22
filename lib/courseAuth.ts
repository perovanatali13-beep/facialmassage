// Доступ к курсу по паролю. Базы данных нет.
// Пароль хранится в COURSE_PASSWORD, секрет подписи cookie — в COURSE_SECRET.
// Cookie содержит подписанный токен, который нельзя подделать без секрета.

export const COOKIE_NAME = "course_access";

const enc = new TextEncoder();

// HMAC-SHA256(secret, "course-access-v1") в hex. Работает на edge и в Node.
export async function signAccessToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("course-access-v1"));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Сравнение без утечки по времени.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
