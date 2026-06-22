import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Самомассаж лица — экспресс-курс Алины Салаватовой",
  description:
    "7-дневный экспресс-курс по самомассажу лица. Упругость, свежесть и тонус без салонов и мастеров.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
