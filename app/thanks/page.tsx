export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Заявка отправлена ✅</h1>
      <p className="mt-3 text-zinc-600">
        Мы получили вашу заявку. Обычно отвечаем быстро — ожидайте звонка или сообщения.
      </p>

      <a
        href="/"
        className="mt-6 inline-flex rounded-xl border px-4 py-2 font-semibold hover:bg-zinc-50"
      >
        Вернуться на главную
      </a>
    </div>
  );
}
