"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Action {
  id: string
  title: string
  dueDate: string
  status: "pending" | "completed"
  customer: string
}

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([
    {
      id: "1",
      title: "Follow up on Invoice #12345",
      dueDate: "2024-02-15",
      status: "pending",
      customer: "Customer A",
    },
  ])

  const handleAddAction = (formData: FormData) => {
    const title = formData.get("title") as string
    const dueDate = formData.get("dueDate") as string
    const customer = formData.get("customer") as string

    if (!title || !dueDate || !customer) return

    const newAction: Action = {
      id: Math.random().toString(36).substring(7),
      title,
      dueDate,
      status: "pending",
      customer,
    }

    setActions([...actions, newAction])
  }

  const handleDeleteAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Actions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={handleAddAction}>
              <DialogHeader>
                <DialogTitle>Add New Action</DialogTitle>
                <DialogDescription>
                  Create a new action for customer follow-up
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" name="customer" placeholder="Enter customer name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Action Title</Label>
                  <Input id="title" name="title" placeholder="Enter action title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Action</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
          <CardDescription>
            View and manage your collection tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">Customer: {action.customer}</p>
                  <p className="text-sm text-muted-foreground">Due: {new Date(action.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {action.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAction(action.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {actions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No actions found. Add a new action to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 