import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to inventory page as the main landing
  redirect("/inventory")
}
