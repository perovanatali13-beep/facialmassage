"use client";

export default function CourseLogout() {
  async function logout() {
    await fetch("/api/course/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button
      onClick={logout}
      className="text-sm text-mocha transition hover:text-terracotta hover:underline"
    >
      Выйти из курса
    </button>
  );
}
