'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

interface AlertDialogProps {
  /** The element that opens the dialog when clicked */
  trigger: React.ReactNode
  /** Dialog title */
  title: string
  /** Dialog description explaining the action */
  description: string
  /** Confirm button label (defaults to "Confirm") */
  confirmLabel?: string
  /** Cancel button label (defaults to "Cancel") */
  cancelLabel?: string
  /** Confirm button variant (defaults to "destructive") */
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  /** Called when the user clicks confirm */
  onConfirm: () => void | Promise<void>
  /** Whether the confirm action is in progress */
  isPending?: boolean
  /** Whether the dialog is disabled (prevents opening) */
  disabled?: boolean
}

export function AlertDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'destructive',
  onConfirm,
  isPending = false,
  disabled = false,
}: AlertDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    await onConfirm()
    setOpen(false)
  }

  return (
    <BaseAlertDialog open={open} onOpenChange={disabled ? undefined : setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog>
  )
}
