import { TourStep } from "@/hooks/use-driver-tour"

// Tours para Registro de Votos
export const registroVotosTour: TourStep[] = [
  {
    element: "#registro-titulo",
    popover: {
      title: "Registro de Votos",
      description:
        "Esta es la sección principal para gestionar todos los votantes y sus registros de voto.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#registro-busqueda",
    popover: {
      title: "Búsqueda de Votantes",
      description:
        "Utiliza este campo para buscar votantes por nombre o número de cédula. La búsqueda es en tiempo real.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#registro-nuevo-btn",
    popover: {
      title: "Registrar Nuevo Votante",
      description:
        "Haz clic aquí para abrir el formulario y registrar un nuevo votante en el sistema.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#registro-tabla",
    popover: {
      title: "Tabla de Votantes",
      description:
        "Esta tabla muestra todos los votantes registrados. Puedes ver su información completa, estado de registro, y fecha de registro. Utiliza los iconos de acciones para editar o eliminar registros.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#registro-tabla-header",
    popover: {
      title: "Columnas de la Tabla",
      description:
        "De izquierda a derecha: Foto (avatar), Nombre Completo, Cédula, Teléfono, Barrio, Puesto de Votación, Estado del registro, Fecha de Registro, y Acciones.",
      side: "top",
      align: "center",
    },
  },
]

// Tours para Modal de Registrar Votante
export const registrarVotanteTour: TourStep[] = [
  {
    element: "#form-nombres",
    popover: {
      title: "Nombres del Votante",
      description:
        "Ingresa los nombres completos del votante. Este campo es obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-apellidos",
    popover: {
      title: "Apellidos del Votante",
      description:
        "Ingresa los apellidos completos del votante. Este campo es obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-cedula",
    popover: {
      title: "Cédula de Identidad",
      description:
        "Ingresa el número de cédula o documento de identidad. Este campo es obligatorio y sirve como identificador único.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-telefono",
    popover: {
      title: "Número de Teléfono",
      description:
        "Ingresa el número de teléfono del votante para contacto. Este campo es opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-direccion",
    popover: {
      title: "Dirección",
      description:
        "Ingresa la dirección residencial completa del votante. Este campo es opcional pero recomendado.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-barrio",
    popover: {
      title: "Barrio",
      description:
        "Especifica el barrio o localidad donde reside el votante. Este campo es opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-puesto",
    popover: {
      title: "Puesto de Votación",
      description:
        "Selecciona el puesto de votación asignado al votante. Este campo es obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-submit",
    popover: {
      title: "Guardar Votante",
      description:
        "Haz clic en este botón para guardar la información del votante en el sistema.",
      side: "top",
      align: "center",
    },
  },
]

// Tours para secciones específicas
export const tablaVotantesTour: TourStep[] = [
  {
    element: "#tabla-avatar",
    popover: {
      title: "Avatar del Votante",
      description:
        "Aquí se muestra el avatar o iniciales del votante registrado.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#tabla-nombre",
    popover: {
      title: "Nombre Completo",
      description:
        "Muestra el nombre y apellido completo del votante registrado.",
      side: "right",
      align: "center",
    },
  },
  {
    element: "#tabla-estado",
    popover: {
      title: "Estado del Votante",
      description:
        "Indica el estado del votante: Registrado (nuevo registro), Verificado (validado), o Pendiente (en revisión).",
      side: "right",
      align: "center",
    },
  },
  {
    element: "#tabla-acciones",
    popover: {
      title: "Acciones",
      description:
        "Usa el menú de tres puntos para acceder a opciones como editar o eliminar el registro del votante.",
      side: "left",
      align: "center",
    },
  },
]

// Tours para Reportes
export const reportesTour: TourStep[] = [
  {
    element: "#reportes-titulo",
    popover: {
      title: "Página de Reportes",
      description:
        "Aquí puedes generar y descargar reportes detallados sobre las votaciones.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#estadisticas-cards",
    popover: {
      title: "Estadísticas Generales",
      description:
        "Muestra un resumen rápido de los registros totales, verificados, pendientes y rechazados.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#reportes-list",
    popover: {
      title: "Reportes Disponibles",
      description:
        "Lista de reportes que puedes generar: Resumen General, Registro por Puestos, Análisis de Participación y Listado de Votantes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#reporte-card",
    popover: {
      title: "Tarjeta de Reporte",
      description:
        "Haz clic en cualquier reporte para descargar o visualizar en Excel o PDF.",
      side: "left",
      align: "center",
    },
  },
]

// Tours para Puestos de Votación
export const puestosTour: TourStep[] = [
  {
    element: "#puestos-titulo",
    popover: {
      title: "Puestos de Votación",
      description:
        "Administra todos los puestos de votación de tu jurisdicción.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#puestos-busqueda",
    popover: {
      title: "Buscar Puesto",
      description:
        "Utiliza este campo para buscar un puesto por nombre, municipio o código.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#puestos-nuevo-btn",
    popover: {
      title: "Agregar Nuevo Puesto",
      description:
        "Haz clic para crear un nuevo puesto de votación.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#puestos-tabla",
    popover: {
      title: "Tabla de Puestos",
      description:
        "Visualiza todos los puestos registrados con información como código, ubicación, cantidad de mesas y estado.",
      side: "top",
      align: "center",
    },
  },
]

// Tour para Modal de Registrar Votante (automático)
export const registrarVotanteModalTour: TourStep[] = [
 /* {
    element: "#modal-titulo-votante",
    popover: {
      title: "Registrar Nuevo Votante",
      description:
        "Completa este formulario para registrar un nuevo votante en el sistema.",
      side: "bottom",
      align: "center",
    },
  },*/
  {
    element: "#form-registrando-para",
    popover: {
      title: "Lider que Registra",
      description:
        "Nombre del lider que esta registrando los votantes.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-nombres",
    popover: {
      title: "Nombres",
      description:
        "Ingresa los nombres completos del votante. Este campo es obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-apellidos",
    popover: {
      title: "Apellidos",
      description:
        "Ingresa los apellidos del votante. Este campo es obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-cedula",
    popover: {
      title: "Cédula de Identidad",
      description:
        "Ingresa el número de cédula único del votante. Sirve como identificador principal.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-telefono",
    popover: {
      title: "Teléfono",
      description:
        "Número de contacto del votante (opcional).",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-direccion",
    popover: {
      title: "Dirección",
      description:
        "Dirección residencial completa (opcional pero recomendado).",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-barrio",
    popover: {
      title: "Barrio",
      description:
        "Especifica el barrio o localidad.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-puesto",
    popover: {
      title: "Puesto de Votación",
      description:
        "Selecciona el puesto de votación asignado. Campo obligatorio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-recomendado",
    popover: {
      title: "Recomendado",
      description:
        "Selecciona el líder o persona recomendada para este votante. Este campo es opcional y facilita la asignación de responsables.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-programa",
    popover: {
      title: "Programa",
      description:
        "Selecciona el programa asociado a este votante. Este campo es opcional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#form-submit",
    popover: {
      title: "Guardar Votante",
      description:
        "Haz clic para guardar el registro del votante en el sistema.",
      side: "top",
      align: "center",
    },
  },
]
