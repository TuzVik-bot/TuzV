import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageCircle,
  Brain,
  Search,
  Minus,
  Plus,
  Check,
  Sparkles,
  Map,
  Target,
  Compass,
} from "lucide-react";
import yuliaPhoto from "@/assets/yulia.jpg";
import stafflowLogo from "@/assets/stafflow-logo.png";

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
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold tracking-tight">Закрытый воркшоп</div>
        <img src={stafflowLogo} alt="Stafflow" className="h-5 w-auto sm:h-6" />
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-10 pb-16 text-center sm:pt-16 sm:pb-24">
        <div
          className="mb-6 inline-block text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--primary)" }}
        >
          Воркшоп для сообщества Stafflow
        </div>
        <h1
          className="text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 60%, var(--foreground)) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Ключ к сердцу и&nbsp;логике собственника
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg">
          Закрытый воркшоп с Юлией Карват — о том, как HR-партнёру быть услышанным
          на уровне C-level.
        </p>

        <div
          className="mx-auto mt-10 flex max-w-md items-center gap-4 rounded-xl bg-card p-4 text-left"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <img
            src={yuliaPhoto}
            alt="Юлия Карват"
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="text-base font-medium">Юлия Карват</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Корпоративный тренер · HR-эксперт
            </div>
          </div>
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

      {/* Program */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="text-center">
          <div
            className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--primary)" }}
          >
            Программа
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Как пройдёт воркшоп
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Шесть последовательных блоков — от понимания себя до конкретного
            roadmap взаимодействия с собственником.
          </p>
        </div>

        <ol className="mt-10 space-y-3">
          {[
            "Личность HR: ценности и границы",
            "Типология HR. Самодиагностика",
            "Типология собственников",
            "Матрица совместимости HR и бизнеса",
            "Непонимание vs. деструктивность",
            "Roadmap: «Как быть услышанным»",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-xl bg-card px-5 py-4"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--primary) 12%, white)",
                  color: "var(--primary)",
                }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium sm:text-base">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="text-center">
          <div
            className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--primary)" }}
          >
            Что вы получите
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Зачем приходить
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            {
              icon: <Sparkles className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              title: "Понимание себя как HR",
              text: "Самодиагностика по типологии: свои сильные стороны, зоны риска и точки роста в роли HR-партнёра.",
            },
            {
              icon: <Compass className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              title: "Карта собственников",
              text: "Научитесь распознавать тип собственника и подбирать язык, на котором он действительно вас услышит.",
            },
            {
              icon: <Target className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              title: "Матрица совместимости",
              text: "Поймёте, где ваш диалог с бизнесом может работать, а где это системный конфликт, который не решить уговорами.",
            },
            {
              icon: <Map className="h-5 w-5" style={{ color: "var(--primary)" }} />,
              title: "Личный roadmap",
              text: "Конкретный план шагов: как перестроить коммуникацию с собственником и быть услышанным на уровне решений.",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                {b.icon}
              </div>
              <h3 className="text-base font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Speaker */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-12">
          <img
            src={yuliaPhoto}
            alt="Юлия Карват"
            className="mx-auto h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52"
            style={{ boxShadow: "var(--shadow-soft)" }}
          />
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Юлия Карват</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Корпоративный тренер · HR-эксперт · Магистр психологических наук
            </p>
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
