"use client";

import { useState } from "react";

export default function AccessForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/course/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = "/course";
        return;
      }
      setStatus("error");
      setMessage(data.error || "Неверный пароль");
    } catch {
      setStatus("error");
      setMessage("Что-то пошло не так. Попробуйте ещё раз.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        required
        autoFocus
        placeholder="Пароль доступа"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay disabled:opacity-60"
      >
        {status === "loading" ? "Проверяем…" : "Войти в курс"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-500">{message}</p>
      )}
    </form>
  );
}
