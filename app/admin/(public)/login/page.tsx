import { Suspense } from "react";
import LoginClient from "./ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-4">Загрузка…</div>}>
      <LoginClient />
    </Suspense>
  );
}
