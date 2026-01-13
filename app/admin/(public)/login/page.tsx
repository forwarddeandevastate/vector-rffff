import { Suspense } from "react";
import LoginClient from "./ui";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}
