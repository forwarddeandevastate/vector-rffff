export function FaqSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Сколько стоит трансфер?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Стоимость трансфера зависит от маршрута, класса автомобиля и расстояния. Оставьте заявку на сайте, и мы быстро рассчитаем цену.",
        },
      },
      {
        "@type": "Question",
        name: "Вы работаете круглосуточно?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, мы работаем 24/7. Можно заказать трансфер в любое время суток.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли заказать трансфер в аэропорт?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, мы выполняем трансферы в аэропорт и из аэропорта. Возможна встреча с табличкой.",
        },
      },
      {
        "@type": "Question",
        name: "Есть ли минивэн для групповых поездок?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, у нас есть минивэны для групповых поездок, семей и корпоративных трансферов.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли оплатить по безналу для компании?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, мы работаем с организациями и предоставляем корпоративные перевозки с оплатой по безналичному расчету.",
        },
      },
      {
        "@type": "Question",
        name: "Как быстро подается автомобиль?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Срок подачи зависит от города и загрузки, но обычно машина подается максимально быстро после подтверждения заказа.",
        },
      },
      {
        "@type": "Question",
        name: "Вы возите междугородние поездки по России?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, мы выполняем междугородние поездки по России. Можно заказать поездку в другой город с комфортом и безопасностью.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}