import { redirect } from "next/navigation";

// El tablero ahora vive en la raíz del sitio; esta ruta se conserva para
// que los enlaces guardados a /dashboard sigan funcionando.
export default function DashboardPage() {
  redirect("/");
}
