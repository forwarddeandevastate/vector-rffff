import LeadForm from "./lead-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-lg font-extrabold tracking-tight">Вектор РФ</div>
            <div className="text-sm text-zinc-600">Трансферы и поездки по России</div>
          </div>

          <a
            href="/admin/login"
            className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            Вход в админку
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-2">
        <section>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Закажите трансфер за 1 минуту
          </h1>
          <p className="mt-3 text-zinc-600">
            Оставьте заявку — диспетчер свяжется с вами и подтвердит поездку.
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">Что вы получите</div>
            <ul className="list-disc pl-5 text-sm text-zinc-700">
              <li>Быстрое подтверждение</li>
              <li>Фиксация маршрута и времени</li>
              <li>Выбор класса авто</li>
            </ul>
          </div>
        </section>

        <section>
          <LeadForm />
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-zinc-600">
          © {new Date().getFullYear()} Вектор РФ
        </div>
      </footer>
    </div>
  );
}
