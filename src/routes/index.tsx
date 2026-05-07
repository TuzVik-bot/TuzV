import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, MessageCircle, Brain, Search, Minus, Plus, Check, User } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Закрытый воркшоп · Stafflow" },
      {
        name: "description",
        content:
          "Закрытый воркшоп для сообщества Stafflow с Юлией Карват. Подтвердите своё участие.",
      },
    ],
  }),
});

function Index() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"yes" | "no" | "">("");
  const [count, setCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; status?: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = true;
    if (!status) newErrors.status = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 py-6 sm:flex-row sm:items-center">
        <div className="text-lg font-semibold tracking-tight">Stafflow</div>
        <div
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs sm:text-sm"
          style={{ backgroundColor: "var(--card)", color: "var(--primary)" }}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Закрытое мероприятие · Только для сообщества Stafflow</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 text-center sm:pt-20 sm:pb-24">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
          Закрытый воркшоп для сообщества Stafflow
        </h1>
        <p className="mt-5 text-base text-muted-foreground sm:text-lg">
          Ключ к сердцу и логике собственника
        </p>

        <div
          className="mx-auto mt-10 max-w-md rounded-xl bg-card px-6 py-5 text-left"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="text-base font-medium">Юлия Карват</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Корпоративный тренер · HR-эксперт · Магистр психологических наук
          </div>
        </div>

        <div className="mt-8 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground sm:text-sm">
          Доступно только участникам сообщества Stafflow
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          О чём этот воркшоп
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <MessageCircle className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              text: "Почему бизнес вас не слышит — даже когда вы приносите правильные цифры и логичные стратегии",
            },
            {
              icon: <Brain className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              text: "Как устроено мышление собственника и по каким правилам строится диалог HR-партнёра с C-level",
            },
            {
              icon: <Search className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              text: "Когда ситуацию можно исправить, а когда не стоит даже пытаться",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                {c.icon}
              </div>
              <p className="text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm italic text-muted-foreground">
          Не советы. Понимание того, как это работает на самом деле.
        </p>
      </section>

      {/* Speaker */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-12">
          <div
            className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-card sm:h-44 sm:w-44"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <User className="h-14 w-14" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Юлия Карват</h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/90">
              {[
                "12+ лет рефакторинга команд и процессов",
                "Тренер первых лиц бизнеса и HR-команд (alfa hub, andersen, igrow)",
                "Автор статей: Habr, Probusiness, Officelife, «Кадровая служба», «Генеральный директор»",
                "Автор Telegram-канала HR Kuluar",
              ].map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--primary)" }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <div
          className="rounded-xl bg-card p-6 sm:p-10"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Подтвердите своё участие
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Места ограничены. Мы бронируем их персонально для каждого участника сообщества.
          </p>

          {submitted ? (
            <div
              className="mt-8 rounded-xl bg-background p-5 text-sm font-medium"
              style={{ color: "var(--primary)", boxShadow: "var(--shadow-soft)" }}
            >
              ✓ Спасибо! Мы зафиксировали вашу регистрацию. Детали воркшопа придут вам отдельно.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Имя и фамилия <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  style={{ borderColor: errors.name ? "#ef4444" : "var(--border)" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Компания</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Ваш статус участия <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "yes", label: "✅ Приду" },
                    { value: "no", label: "❌ Не смогу прийти в этот раз" },
                  ].map((opt) => {
                    const selected = status === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setStatus(opt.value as "yes" | "no")}
                        className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm transition hover:border-[var(--primary)]"
                        style={{
                          borderColor: selected
                            ? "var(--primary)"
                            : errors.status
                              ? "#ef4444"
                              : "var(--border)",
                          backgroundColor: selected
                            ? "color-mix(in oklab, var(--primary) 6%, white)"
                            : "var(--background)",
                        }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                          style={{
                            borderColor: selected ? "var(--primary)" : "var(--border)",
                          }}
                        >
                          {selected && (
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: "var(--primary)" }}
                            />
                          )}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {status === "yes" && (
                <div className="animate-fade-in">
                  <label className="mb-2 block text-sm font-medium">
                    Количество человек от вашей компании
                  </label>
                  <div className="inline-flex items-center gap-1 rounded-xl border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setCount((c) => Math.max(1, c - 1))}
                      disabled={count <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-card disabled:opacity-40"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 text-center text-sm font-medium">{count}</div>
                    <button
                      type="button"
                      onClick={() => setCount((c) => Math.min(5, c + 1))}
                      disabled={count >= 5}
                      className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-card disabled:opacity-40"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition hover:brightness-95 sm:w-auto sm:min-w-56"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  Подтвердить участие
                </span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-10">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Stafflow · Закрытое мероприятие для сообщества платформы
        </p>
      </footer>
    </div>
  );
}
