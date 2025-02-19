"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Trash2, Pencil as PencilIcon } from "lucide-react"
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
import { supabase } from "@/lib/supabase"
import { Textarea } from "@/components/ui/textarea"

interface Action {
  id: number
  parent_name: string
  action_requested_on: string
  action_owner: string
  comment: string
  total: number
}

export default function MCSActionsPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingAction, setEditingAction] = useState<Action | null>(null)

  // Clear messages when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setError(null)
      setSuccess(null)
    }
  }

  async function fetchActions() {
    try {
      const { data, error } = await supabase
        .from('sorted_actions_data')
        .select('id, parent_name, action_requested_on, action_owner, comment, total')
        .eq('entity', 'MCS')
        
      if (error) {
        console.error('Error fetching actions:', error)
        return
      }

      setActions(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActions()
  }, [])

  const handleAddAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const parent_name = formData.get('parent_name') as string
      const total = parseFloat(formData.get('total') as string)
      const action_owner = formData.get('action_owner') as string
      const comment = formData.get('comment') as string
      const action_requested_on = formData.get('action_requested_on') as string

      if (!parent_name || !total || !action_owner || !action_requested_on) {
        setError('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      const newAction = {
        entity: 'MCS',
        parent_name,
        total,
        action_owner,
        comment,
        action_requested_on: new Date(action_requested_on).toISOString()
      }

      const { error: insertError } = await supabase
        .from('actions_data')
        .insert([newAction])

      if (insertError) {
        console.error('Error details:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        })
        setError(`Failed to add action: ${insertError.message}`)
        setIsSubmitting(false)
        return
      }

      await fetchActions()
      setSuccess('Action added successfully')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAction = async (id: number) => {
    try {
      const { error } = await supabase
        .from('actions_data')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting action:', error)
        return
      }

      // Refresh the actions list
      fetchActions()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEditComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      if (!editingAction) return

      const formData = new FormData(e.currentTarget)
      const newComment = formData.get('comment') as string

      const { error } = await supabase
        .from('actions_data')
        .update({ comment: newComment })
        .eq('id', editingAction.id)

      if (error) {
        console.error('Error updating comment:', error)
        setError('Failed to update comment')
        return
      }

      // Refresh the actions list
      await fetchActions()
      
      // Reset edit state
      setEditingAction(null)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to update comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">MCS Actions</h1>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading actions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Show either success or error message, not both */}
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg">
          {success}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">MCS Actions</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAction}>
              <DialogHeader>
                <DialogTitle>Add New MCS Action</DialogTitle>
                <DialogDescription>
                  Create a new action for MCS customer follow-up
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent_name">Customer Name</Label>
                  <Input id="parent_name" name="parent_name" placeholder="Enter customer name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action_owner">Action Owner</Label>
                  <Input id="action_owner" name="action_owner" placeholder="Enter action owner" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action_requested_on">Requested Date</Label>
                  <Input 
                    id="action_requested_on" 
                    name="action_requested_on" 
                    type="date" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total">Total Amount</Label>
                  <Input 
                    id="total" 
                    name="total" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="Enter total amount" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea id="comment" name="comment" placeholder="Enter comment" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Action'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Actions List</CardTitle>
          <CardDescription>
            View and manage your MCS collection tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex-1">
                  <h3 className="font-semibold">{action.parent_name}</h3>
                  <p className="text-sm text-muted-foreground">Owner: {action.action_owner}</p>
                  <p className="text-sm text-muted-foreground">Requested: {new Date(action.action_requested_on).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">{action.comment}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(action.total)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingAction(action)}
                    className="hover:bg-blue-50"
                  >
                    <PencilIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAction(action.id)}
                    className="hover:bg-red-50"
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

            {/* Edit Comment Dialog */}
            <Dialog open={!!editingAction} onOpenChange={(open) => !open && setEditingAction(null)}>
              <DialogContent>
                <form onSubmit={handleEditComment}>
                  <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogDescription>
                      Update the comment for {editingAction?.parent_name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        name="comment"
                        placeholder="Enter comment"
                        defaultValue={editingAction?.comment}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingAction(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 