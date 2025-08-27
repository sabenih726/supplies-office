import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { employeeName, department, items } = body

    const requestPromises = items.map(async (item: any) => {
      const { data, error } = await supabase
        .from("requests")
        .insert({
          employee_name: employeeName,
          department: department,
          item_name: item.name,
          quantity: item.quantity,
          reason: item.reason,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error
      return data
    })

    const requests = await Promise.all(requestPromises)

    return NextResponse.json(requests, { status: 201 })
  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}
