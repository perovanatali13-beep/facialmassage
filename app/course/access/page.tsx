import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AccessForm from "./AccessForm";

export const metadata: Metadata = {
  title: "Доступ к курсу — самомассаж лица",
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <>
      <SiteHeader />
      <section className="py-20">
        <div className="mx-auto max-w-md px-5">
          <div className="rounded-soft border border-sand bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-terracotta">
              Закрытый курс
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-espresso">
              Доступ к курсу
            </h1>
            <p className="mt-3 text-mocha">
              Введите пароль доступа, который вы получили после покупки курса.
            </p>
            <div className="mt-6">
              <AccessForm />
            </div>
            <p className="mt-5 text-center text-sm text-mocha">
              Ещё не приобрели курс?{" "}
              <a href="/#pricing" className="text-terracotta hover:underline">
                Оставить заявку
              </a>
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
