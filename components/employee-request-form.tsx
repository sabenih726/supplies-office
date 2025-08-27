"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Send, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface RequestItem {
  name: string
  quantity: number
  reason: string
}

export function EmployeeRequestForm() {
  const [employeeName, setEmployeeName] = useState("")
  const [department, setDepartment] = useState("")
  const [requestItems, setRequestItems] = useState<RequestItem[]>([{ name: "", quantity: 1, reason: "" }])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addRequestItem = () => {
    setRequestItems([...requestItems, { name: "", quantity: 1, reason: "" }])
  }

  const removeRequestItem = (index: number) => {
    if (requestItems.length > 1) {
      setRequestItems(requestItems.filter((_, i) => i !== index))
    }
  }

  const updateRequestItem = (index: number, field: keyof RequestItem, value: string | number) => {
    const updated = requestItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setRequestItems(updated)
  }

  const handleSubmitRequest = async () => {
    if (!employeeName || !department) {
      toast({
        title: "Error",
        description: "Please fill in your name and department",
        variant: "destructive",
      })
      return
    }

    const incompleteItems = requestItems.some((item) => !item.name || !item.reason || item.quantity < 1)

    if (incompleteItems) {
      toast({
        title: "Error",
        description: "Please complete all item details (name, quantity, and reason)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          department,
          items: requestItems,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your request has been submitted successfully",
        })
        // Reset form
        setEmployeeName("")
        setDepartment("")
        setRequestItems([{ name: "", quantity: 1, reason: "" }])
      } else {
        throw new Error("Failed to submit request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Request Office Supplies</h1>
            <p className="text-muted-foreground mt-2">Submit office supplies request</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Employee Information
              </CardTitle>
              <CardDescription>Please provide details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee-name">Full Name</Label>
                  <Input
                    id="employee-name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Product Support">Product Support</SelectItem>
                      <SelectItem value="SCCP">SCCP</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="PP SC">PP SC</SelectItem>
                      <SelectItem value="RUE">RUE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Items */}
          <Card>
            <CardHeader>
              <CardTitle>Requested Items</CardTitle>
              <CardDescription>Specify the office supplies you need</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {requestItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {requestItems.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeRequestItem(index)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Item Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateRequestItem(index, "name", e.target.value)}
                        placeholder="e.g., Kertas A4, Pulpen Biru"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateRequestItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Reason for Request</Label>
                    <Textarea
                      value={item.reason}
                      onChange={(e) => updateRequestItem(index, "reason", e.target.value)}
                      placeholder="Explain why you need this item..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addRequestItem} className="w-fit bg-transparent">
                Add Another Item
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/inventory">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSubmitRequest} disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
