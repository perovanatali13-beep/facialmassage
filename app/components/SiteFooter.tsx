import { content } from "@/lib/content";

export default function SiteFooter() {
  const contacts = content.contacts;
  return (
    <footer className="mt-24 border-t border-sand bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-espresso">
            Алина Салаватова
          </p>
          <p className="mt-2 max-w-xs text-sm text-mocha">
            Самомассаж лица — навык, который остаётся с вами на всю жизнь.
          </p>
        </div>
        <div className="text-sm text-mocha">
          <p className="mb-3 font-medium text-espresso">Контакты</p>
          <p>Телефон: {contacts.phone}</p>
          <p>Email: {contacts.email}</p>
          <p>Telegram: {contacts.telegram}</p>
        </div>
        <div className="text-sm text-mocha">
          <p className="mb-3 font-medium text-espresso">Навигация</p>
          <a href="#about" className="block hover:text-terracotta">Об авторе</a>
          <a href="#contents" className="block hover:text-terracotta">Программа</a>
          <a href="#pricing" className="block hover:text-terracotta">Заявка</a>
        </div>
      </div>
      <div className="border-t border-sand py-5 text-center text-xs text-mocha">
        © {new Date().getFullYear()} Самомассаж лица. Все права защищены.
      </div>
    </footer>
  );
}
