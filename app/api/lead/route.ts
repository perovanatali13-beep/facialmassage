import { NextResponse } from "next/server";

// Куда приходят заявки. Можно переопределить через переменную окружения.
const LEAD_TO = process.env.LEAD_TO || "perova.natali13@gmail.com";
// Адрес отправителя. На бесплатном тарифе Resend используется onboarding@resend.dev.
const EMAIL_FROM = process.env.EMAIL_FROM || "Заявки с сайта <onboarding@resend.dev>";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    const cleanName = String(name).slice(0, 200);
    const cleanEmail = String(email).slice(0, 200);
    const cleanPhone = String(phone).slice(0, 50);

    const key = process.env.RESEND_API_KEY;

    // Если почта не настроена — не теряем заявку, пишем её в лог сервера.
    if (!key) {
      console.warn(
        "[lead] RESEND_API_KEY не задан. Заявка получена, но письмо не отправлено:",
        { name: cleanName, email: cleanEmail, phone: cleanPhone }
      );
      return NextResponse.json({ ok: true, emailed: false });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#2c2520">
        <h2 style="color:#b5806b;margin:0 0 16px">Новая заявка на курс самомассажа</h2>
        <table style="border-collapse:collapse;font-size:15px">
          <tr><td style="padding:6px 16px 6px 0;color:#5c5048">Имя</td><td style="font-weight:bold">${esc(cleanName)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#5c5048">Email</td><td style="font-weight:bold">${esc(cleanEmail)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#5c5048">Телефон</td><td style="font-weight:bold">${esc(cleanPhone)}</td></tr>
        </table>
        <p style="color:#a89c92;font-size:13px;margin-top:20px">
          Отправлено с сайта самомассажа лица · ${new Date().toLocaleString("ru-RU")}
        </p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: LEAD_TO,
        reply_to: cleanEmail,
        subject: `Новая заявка: ${cleanName}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[lead] Resend error:", res.status, detail);
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Попробуйте позже." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
