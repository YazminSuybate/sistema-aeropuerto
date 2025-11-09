"use client"

import { useState, useEffect } from "react"

// Mock data para tickets disponibles
const mockTicketsDisponibles = [
  {
    id: 1,
    titulo: "Revisar solicitud de crédito #001",
    prioridad: "Alta",
    estado: "Abierto",
  },
  {
    id: 2,
    titulo: "Verificar documentación cliente",
    prioridad: "Media",
    estado: "Abierto",
  },
  {
    id: 3,
    titulo: "Procesar pago atrasado",
    prioridad: "Alta",
    estado: "Abierto",
  },
  {
    id: 4,
    titulo: "Generar reporte mensual",
    prioridad: "Baja",
    estado: "Abierto",
  },
]

// Mock data para tickets asignados
const mockTicketsAsignados = [
  {
    id: 101,
    titulo: "Resolver reclamo cliente #A45",
    prioridad: "Alta",
    estado: "En Proceso",
  },
  {
    id: 102,
    titulo: "Actualizar base de datos",
    prioridad: "Media",
    estado: "En Proceso",
  },
]

export const useBandejaOperativo = () => {
  const [disponibles, setDisponibles] = useState([])
  const [asignados, setAsignados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simular carga de 1 segundo
    const timer = setTimeout(() => {
      try {
        setDisponibles(mockTicketsDisponibles)
        setAsignados(mockTicketsAsignados)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos")
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return {
    disponibles,
    asignados,
    loading,
    error,
  }
}