import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    const { status } = body

    const { data: requestData, error: fetchError } = await supabase
      .from("requests")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError) throw fetchError

    // Update request status
    const { data, error } = await supabase
      .from("requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    if (status === "approved") {
      const { data: itemData, error: itemFetchError } = await supabase
        .from("items")
        .select("*")
        .ilike("name", `%${requestData.item_name}%`)
        .single()

      if (!itemFetchError && itemData) {
        const newStock = Math.max(0, itemData.stock - requestData.quantity)

        await supabase
          .from("items")
          .update({
            stock: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", itemData.id)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating request:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}
