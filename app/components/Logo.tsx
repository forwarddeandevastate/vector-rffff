export default function Logo() {
  return (
    <svg
      width="340"
      height="84"
      viewBox="0 0 340 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="vrGrad"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0EA5E9" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* icon */}
      <rect x="0" y="10" width="64" height="64" rx="16" fill="url(#vrGrad)" />
      <rect
        x="0.75"
        y="10.75"
        width="62.5"
        height="62.5"
        rx="15.25"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
      />

      <text
        x="16"
        y="52"
        fontSize="28"
        fontWeight="800"
        fill="white"
        fontFamily="Manrope, Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
      >
        ВР
      </text>

      {/* text */}
      <text
        x="84"
        y="44"
        fontSize="26"
        fontWeight="800"
        fill="#0F172A"
        fontFamily="Manrope, Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
      >
        ВЕКТОР РФ
      </text>

      <text
        x="84"
        y="64"
        fontSize="12"
        fontWeight="650"
        fill="#475569"
        fontFamily="Manrope, Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
      >
        трансферы • межгород • аэропорты
      </text>
    </svg>
  );
}
