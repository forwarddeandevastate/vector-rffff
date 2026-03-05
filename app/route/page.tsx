import { redirect } from "next/navigation";

// Старый хаб /route -> сейчас используем городские страницы /{city}
export default function Page() {
  redirect("/city");
}
