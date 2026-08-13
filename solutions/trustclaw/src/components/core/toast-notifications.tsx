import { toast } from 'sonner'
import { parseTrpcError } from '~/clients/trpc/errors'

export function showSuccessToast(message: string) {
  toast.success(message)
}

export function showErrorToast(message: string) {
  toast.error(message)
}

export function showLoadingToast(message: string) {
  return toast.loading(message)
}

export function showInfoToast(message: string) {
  toast.info(message)
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId)
}

export function showTrpcErrorToast(error: unknown) {
  const { title, description } = parseTrpcError(error)
  toast.error(title, { description })
}

export function trpcToastOnError(error: unknown) {
  showTrpcErrorToast(error)
}
