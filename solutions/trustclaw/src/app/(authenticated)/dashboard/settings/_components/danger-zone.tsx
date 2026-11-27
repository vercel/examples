'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trpc } from '~/clients/trpc'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  showSuccessToast,
  trpcToastOnError,
} from '~/components/core/toast-notifications'

const CONFIRM_TEXT = 'delete my instance'

export function DangerZone() {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  const deleteInstance = trpc.trustclaw.deleteInstance.useMutation({
    onSuccess: () => {
      showSuccessToast('TrustClaw instance deleted')
      router.push('/dashboard')
    },
    onError: trpcToastOnError,
  })

  const isConfirmed = confirmText === CONFIRM_TEXT

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions - proceed with caution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Delete TrustClaw Instance</p>
            <p className="text-muted-foreground text-sm">
              Permanently deletes your instance, all messages, memories, and
              cron jobs.
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v)
              if (!v) setConfirmText('')
            }}
          >
            <Button variant="destructive" onClick={() => setOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Instance
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete TrustClaw Instance</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All messages, memories, cron
                  jobs, and settings will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <Label>
                  Type <strong>{CONFIRM_TEXT}</strong> to confirm
                </Label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_TEXT}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" disabled={deleteInstance.isPending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={!isConfirmed || deleteInstance.isPending}
                  onClick={() => void deleteInstance.mutateAsync()}
                >
                  {deleteInstance.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Instance'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
