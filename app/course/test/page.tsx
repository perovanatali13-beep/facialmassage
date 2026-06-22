import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SkinTest from "./SkinTest";

export const metadata: Metadata = {
  title: "Тест на тип кожи — курс самомассажа",
  description:
    "Анкета по классификации Лесли Бауманн: определите свой тип кожи и получите рекомендации по уходу.",
};

export default function TestPage() {
  return (
    <>
      <SiteHeader />
      <SkinTest />
      <SiteFooter />
    </>
  );
}
