/**
 * Tipos de Datos Esperados para los Endpoints de la API
 * Usar como referencia para crear el backend
 */

// ============================================
// VOTANTES
// ============================================

interface Votante {
  id: number
  nombre: string
  cedula: string
  email: string
  telefono: string
  direccion: string
  estado: "activo" | "inactivo"
}

// Endpoint: GET /api/votantes
// Response: Votante[]

// Endpoint: POST /api/votantes
// Body: Omit<Votante, 'id'>
// Response: Votante

// Endpoint: PUT /api/votantes/{id}
// Body: Partial<Omit<Votante, 'id'>>
// Response: Votante

// Endpoint: DELETE /api/votantes/{id}
// Response: { success: boolean }

// ============================================
// PUESTOS
// ============================================

interface Puesto {
  id: number
  nombre: string
  direccion: string
  mesas: number
  votantes: number
  horario: string
  estado: "activo" | "inactivo"
}

// Endpoint: GET /api/puestos
// Response: Puesto[]

// Endpoint: POST /api/puestos
// Body: Omit<Puesto, 'id'>
// Response: Puesto

// Endpoint: PUT /api/puestos/{id}
// Body: Partial<Omit<Puesto, 'id'>>
// Response: Puesto

// Endpoint: DELETE /api/puestos/{id}
// Response: { success: boolean }

// ============================================
// VOTOS
// ============================================

interface Voto {
  id: number
  votante: string
  puesto: string
  candidato: string
  fechaHora: string
  estado: "registrado" | "verificado" | "pendiente"
}

// Endpoint: GET /api/votos
// Response: Voto[]

// Endpoint: POST /api/votos
// Body: Omit<Voto, 'id'>
// Response: Voto

// Endpoint: PUT /api/votos/{id}
// Body: Partial<Omit<Voto, 'id'>>
// Response: Voto

// Endpoint: DELETE /api/votos/{id}
// Response: { success: boolean }

// ============================================
// REPORTES
// ============================================

interface Resumen {
  totalVotantes: number
  totalVotosRegistrados: number
  porcentajeParticipacion: number
  votantesFaltantes: number
}

// Endpoint: GET /api/reportes/resumen
// Response: Resumen

interface ReportePorPuesto {
  puesto: string
  votosRegistrados: number
  porcentaje: number
}

// Endpoint: GET /api/reportes/por-puesto
// Response: ReportePorPuesto[]

interface ReportePorGenero {
  genero: "M" | "F"
  cantidad: number
  porcentaje: number
}

// Endpoint: GET /api/reportes/por-genero
// Response: ReportePorGenero[]

interface ReportePorEdad {
  rangoEdad: string
  cantidad: number
  porcentaje: number
}

// Endpoint: GET /api/reportes/por-edad
// Response: ReportePorEdad[]

// Endpoint: GET /api/reportes/export-csv
// Response: CSV file (application/csv)

// Endpoint: GET /api/reportes/export-pdf
// Response: PDF file (application/pdf)

// ============================================
// CONFIGURACIÓN
// ============================================

interface Configuracion {
  nombreEvento: string
  fecha: string
  lugar: string
  horaInicio: string
  horaFin: string
  emailAdmin?: string
  telefonoAdmin?: string
}

// Endpoint: GET /api/configuracion
// Response: Configuracion

// Endpoint: PUT /api/configuracion
// Body: Partial<Configuracion>
// Response: Configuracion

// ============================================
// RESPUESTAS DE ERROR (Estándar)
// ============================================

interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

// HTTP Status Codes esperados:
// 200 - OK
// 201 - Created
// 400 - Bad Request
// 401 - Unauthorized
// 404 - Not Found
// 500 - Internal Server Error

// ============================================
// EJEMPLO: Estructura de Backend (Node.js/Express)
// ============================================

/*

// Rutas de ejemplo
app.get('/api/votantes', async (req, res) => {
  try {
    const votantes = await db.votantes.findAll();
    res.json(votantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/votantes', async (req, res) => {
  try {
    const votante = await db.votantes.create(req.body);
    res.status(201).json(votante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/votantes/:id', async (req, res) => {
  try {
    const votante = await db.votantes.update(req.params.id, req.body);
    res.json(votante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/votantes/:id', async (req, res) => {
  try {
    await db.votantes.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reportes
app.get('/api/reportes/resumen', async (req, res) => {
  try {
    const resumen = {
      totalVotantes: 1250,
      totalVotosRegistrados: 847,
      porcentajeParticipacion: 67.76,
      votantesFaltantes: 403
    };
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

*/
