import { useState } from 'react'
import toast from 'react-hot-toast'

interface UseApiToastState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseApiToastOptions {
  loadingMessage?: string
  successMessage?: string
  errorMessage?: string
  showLoading?: boolean
}

export function useApiToast<T>(
  options: UseApiToastOptions = {}
) {
  const {
    loadingMessage = 'Procesando...',
    successMessage = 'Operación exitosa',
    errorMessage = 'Error en la operación',
    showLoading = true,
  } = options

  const [state, setState] = useState<UseApiToastState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = async (apiCall: () => Promise<T>) => {
    let toastId: string | undefined
    
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      
      if (showLoading) {
        toastId = toast.loading(loadingMessage)
      }

      const result = await apiCall()
      
      if (toastId) {
        toast.success(successMessage, { id: toastId })
      } else {
        toast.success(successMessage)
      }
      
      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido')
      
      if (toastId) {
        toast.error(errorMessage, { id: toastId })
      } else {
        toast.error(`${errorMessage}: ${error.message}`)
      }
      
      setState({ data: null, loading: false, error })
      throw error
    }
  }

  return {
    ...state,
    execute,
  }
}
