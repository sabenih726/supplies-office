import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminAuth } from "@/components/admin-auth"
import { cookies } from "next/headers"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAdminAuthenticated = cookieStore.get("admin-auth")?.value === "true"

  if (!isAdminAuthenticated) {
    return <AdminAuth />
  }

  return <AdminDashboard />
}
