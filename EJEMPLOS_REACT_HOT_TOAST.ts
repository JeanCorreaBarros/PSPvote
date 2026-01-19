/**
 * EJEMPLOS DE USO - react-hot-toast con API
 * 
 * Este archivo muestra cómo usar el hook useApiToast en tus componentes
 */

import { useApiToast } from '@/hooks/use-api-toast'
import { votantesApi, puestosApi, usersApi } from '@/lib/api'

// ============================================
// EJEMPLO 1: Crear un votante
// ============================================
export function CreateVotanteExample() {
  const { data, loading, error, execute } = useApiToast({
    loadingMessage: 'Creando votante...',
    successMessage: 'Votante creado exitosamente',
    errorMessage: 'Error al crear el votante',
  })

  const handleCreate = async (votanteData: any) => {
    try {
      const newVotante = await execute(() =>
        votantesApi.create(votanteData)
      )
      console.log('Votante creado:', newVotante)
    } catch (err) {
      console.error('Error capturado:', err)
    }
  }

  return (
    <button onClick={() => handleCreate({ nombre: 'Juan' })} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Votante'}
    </button>
  )
}

// ============================================
// EJEMPLO 2: Actualizar un usuario
// ============================================
export function UpdateUserExample() {
  const { execute, loading } = useApiToast({
    loadingMessage: 'Actualizando usuario...',
    successMessage: 'Usuario actualizado correctamente',
    errorMessage: 'No se pudo actualizar el usuario',
  })

  const handleUpdateUser = async (userId: string, newData: any) => {
    try {
      await execute(() => usersApi.update(userId, newData))
    } catch (err) {
      // El error ya se mostró en el toast
    }
  }

  return (
    <button
      onClick={() => handleUpdateUser('user-123', { username: 'nuevo_nombre' })}
      disabled={loading}
    >
      Actualizar Usuario
    </button>
  )
}

// ============================================
// EJEMPLO 3: Eliminar un puesto
// ============================================
export function DeletePuestoExample() {
  const { execute, loading } = useApiToast({
    loadingMessage: 'Eliminando puesto...',
    successMessage: 'Puesto eliminado exitosamente',
    errorMessage: 'Error al eliminar el puesto',
  })

  const handleDeletePuesto = async (puestoId: number) => {
    try {
      await execute(() => puestosApi.delete(puestoId))
    } catch (err) {
      // Error ya manejado por el hook
    }
  }

  return (
    <button onClick={() => handleDeletePuesto(1)} disabled={loading}>
      Eliminar Puesto
    </button>
  )
}

// ============================================
// EJEMPLO 4: Sin mensajes personalizados (usa defaults)
// ============================================
export function SimpleApiCallExample() {
  const { execute, loading } = useApiToast()

  const handleGetVotantes = async () => {
    try {
      const votantes = await execute(() => votantesApi.getAll())
      console.log('Votantes:', votantes)
    } catch (err) {
      // Error ya mostrado automáticamente
    }
  }

  return (
    <button onClick={handleGetVotantes} disabled={loading}>
      Cargar Votantes
    </button>
  )
}

// ============================================
// EJEMPLO 5: Desactivar el toast de carga
// ============================================
export function QuietLoadingExample() {
  const { execute, loading } = useApiToast({
    loadingMessage: 'Procesando...',
    successMessage: 'Completado',
    errorMessage: 'Falló',
    showLoading: false, // No mostrar el toast de carga
  })

  const handleQuietOperation = async () => {
    try {
      await execute(() => votantesApi.getAll())
    } catch (err) {
      // Solo mostrará toasts de error/éxito
    }
  }

  return (
    <button onClick={handleQuietOperation} disabled={loading}>
      Operación Silenciosa
    </button>
  )
}

// ============================================
// EJEMPLO 6: En un formulario con validación
// ============================================
import { useState } from 'react'

export function FormWithValidationExample() {
  const [formData, setFormData] = useState({ nombre: '', apellido: '' })
  const { execute, loading } = useApiToast({
    loadingMessage: 'Guardando datos...',
    successMessage: 'Datos guardados correctamente',
    errorMessage: 'Error al guardar los datos',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar antes de enviar
    if (!formData.nombre || !formData.apellido) {
      // Usar toast.error directamente para validaciones
      const toast = require('react-hot-toast').default
      toast.error('Por favor completa todos los campos')
      return
    }

    try {
      await execute(() => votantesApi.create(formData))
      // Limpiar el formulario después del éxito
      setFormData({ nombre: '', apellido: '' })
    } catch (err) {
      // Error ya manejado
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Apellido"
        value={formData.apellido}
        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
