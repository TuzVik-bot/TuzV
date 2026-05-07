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
  Send,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";

const CALENDAR_URL =
  "https://www.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Практический воркшоп от Stafflow") +
  "&dates=20260521T093000/20260521T113000" +
  "&ctz=Europe/Minsk" +
  "&location=" + encodeURIComponent("г. Минск, ул. Шаранговича 4, Центр притяжения Igrow") +
  "&details=" + encodeURIComponent("Закрытый воркшоп для сообщества Stafflow с Юлией Карват.");
import yuliaPhoto from "@/assets/yulia.jpg";
import stafflowLogo from "@/assets/stafflow-logo.png";
import { supabase } from "@/integrations/supabase/client";

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: boolean; status?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = true;
    if (!status) newErrors.status = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    const { error } = await supabase.from("registrations").insert({
      name: name.trim(),
      company: company.trim() || null,
      status,
      attendee_count: status === "yes" ? count : 1,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("Не удалось отправить. Попробуйте ещё раз.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] -right-32 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-32 h-[360px] w-[360px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #ffd6e8 0%, transparent 70%)",
        }}
      />

      {/* Navbar — logo centered */}
      <header className="relative mx-auto flex max-w-5xl items-center justify-center px-6 py-6">
        <img src={stafflowLogo} alt="Stafflow" className="h-6 w-auto sm:h-7" />
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-3xl px-6 pt-8 pb-16 text-center sm:pt-14 sm:pb-24">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em]"
          style={{
            color: "var(--primary)",
            borderColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--primary) 6%, white)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
          Воркшоп для сообщества Stafflow
        </div>
        <h1
          className="text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 50%, #ec4899 100%)",
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
          className="mx-auto mt-10 flex max-w-md items-center gap-4 rounded-2xl border bg-card/80 p-4 text-left backdrop-blur"
          style={{
            boxShadow: "var(--shadow-elevated)",
            borderColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
          }}
        >
          <img
            src={yuliaPhoto}
            alt="Юлия Карват"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-offset-2"
            style={{ ["--tw-ring-color" as string]: "var(--primary)" }}
          />
          <div className="flex-1">
            <div className="text-base font-medium">Юлия Карват</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Корпоративный тренер · HR-эксперт
            </div>
          </div>
          <a
            href="https://t.me/hr_kuluar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #229ED9, #2AABEE)" }}
          >
            <Send className="h-3.5 w-3.5" />
            Telegram
          </a>
        </div>
      </section>

      {/* About */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          О чём этот воркшоп
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <MessageCircle className="h-5 w-5 text-white" />,
              text: "Почему бизнес вас не слышит — даже когда вы приносите правильные цифры и логичные стратегии",
            },
            {
              icon: <Brain className="h-5 w-5 text-white" />,
              text: "Как устроено мышление собственника и по каким правилам строится диалог HR-партнёра с C-level",
            },
            {
              icon: <Search className="h-5 w-5 text-white" />,
              text: "Когда ситуацию можно исправить, а когда не стоит даже пытаться",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border bg-card p-6 transition hover:-translate-y-1"
              style={{
                boxShadow: "var(--shadow-soft)",
                borderColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
              }}
            >
              <div
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), #8b5cf6)",
                  boxShadow: "0 8px 20px -8px var(--primary)",
                }}
              >
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
      <section className="relative mx-auto max-w-3xl px-6 pb-20">
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
              className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 transition hover:translate-x-1"
              style={{
                boxShadow: "var(--shadow-soft)",
                borderColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
              }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), #8b5cf6)",
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
      <section className="relative mx-auto max-w-5xl px-6 pb-20">
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
              icon: <Sparkles className="h-5 w-5 text-white" />,
              title: "Понимание себя как HR",
              text: "Самодиагностика по типологии: свои сильные стороны, зоны риска и точки роста в роли HR-партнёра.",
              gradient: "linear-gradient(135deg, var(--primary), #8b5cf6)",
            },
            {
              icon: <Compass className="h-5 w-5 text-white" />,
              title: "Карта собственников",
              text: "Научитесь распознавать тип собственника и подбирать язык, на котором он действительно вас услышит.",
              gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            },
            {
              icon: <Target className="h-5 w-5 text-white" />,
              title: "Матрица совместимости",
              text: "Поймёте, где ваш диалог с бизнесом может работать, а где это системный конфликт, который не решить уговорами.",
              gradient: "linear-gradient(135deg, #ec4899, #f59e0b)",
            },
            {
              icon: <Map className="h-5 w-5 text-white" />,
              title: "Личный roadmap",
              text: "Конкретный план шагов: как перестроить коммуникацию с собственником и быть услышанным на уровне решений.",
              gradient: "linear-gradient(135deg, #06b6d4, var(--primary))",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-6 transition hover:-translate-y-1"
              style={{
                boxShadow: "var(--shadow-soft)",
                borderColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
              }}
            >
              <div
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
                style={{ background: b.gradient }}
              >
                {b.icon}
              </div>
              <h3 className="text-base font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Speaker */}
      <section className="relative mx-auto max-w-4xl px-6 pb-20">
        <div
          className="rounded-3xl border bg-card/80 p-8 backdrop-blur sm:p-12"
          style={{
            boxShadow: "var(--shadow-elevated)",
            borderColor: "color-mix(in oklab, var(--primary) 12%, transparent)",
          }}
        >
          <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-12">
            <div className="relative mx-auto">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-full blur-xl opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), #ec4899)",
                }}
              />
              <img
                src={yuliaPhoto}
                alt="Юлия Карват"
                className="relative h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52"
              />
            </div>
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
              <a
                href="https://t.me/hr_kuluar"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #229ED9, #2AABEE)" }}
              >
                <Send className="h-4 w-4" />
                Telegram-канал HR Kuluar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Place & Time */}
      <section className="relative mx-auto max-w-3xl px-6 pb-16">
        <div
          className="relative overflow-hidden rounded-3xl border bg-card/80 p-6 backdrop-blur sm:p-10"
          style={{
            boxShadow: "var(--shadow-elevated)",
            borderColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
          }}
        >
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 50%, transparent), transparent)",
            }}
          />
          <div className="relative grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary), #8b5cf6)" }}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Когда
                </div>
                <div className="mt-1 text-base font-semibold sm:text-lg">
                  21 мая (четверг), 09:30
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Где
                </div>
                <div className="mt-1 text-base font-semibold sm:text-lg">
                  г. Минск, ул. Шаранговича 4
                </div>
                <div className="text-sm text-muted-foreground">
                  Центр притяжения Igrow
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-6 flex justify-center">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium transition hover:border-[var(--primary)] hover:-translate-y-0.5"
              style={{
                borderColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <Calendar className="h-4 w-4" style={{ color: "var(--primary)" }} />
              Добавить в Google-Календарь
            </a>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="relative mx-auto max-w-2xl px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-10"
          style={{
            boxShadow: "var(--shadow-elevated)",
            borderColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 50%, transparent), transparent)",
            }}
          />
          <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
            Подтвердите своё участие
          </h2>

          {submitted ? (
            <div
              className="relative mt-8 rounded-2xl p-5 text-sm font-medium text-white"
              style={{
                background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
              }}
            >
              ✓ Спасибо! Мы зафиксировали вашу регистрацию. Детали воркшопа придут вам отдельно.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative mt-8 space-y-6" noValidate>
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

              {submitError && (
                <p className="text-sm" style={{ color: "#ef4444" }}>{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl px-6 py-3.5 text-sm font-medium text-white shadow-lg transition hover:brightness-110 disabled:opacity-60 sm:w-auto sm:min-w-56"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), #8b5cf6)",
                  boxShadow: "0 10px 24px -10px var(--primary)",
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  {submitting ? "Отправляем…" : "Подтвердить участие"}
                </span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 pb-10">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Stafflow · Закрытое мероприятие для сообщества платформы
        </p>
      </footer>
    </div>
  );
}
