

interface GraficoDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface DashboardStats {
  kpis: {
    totalAlumnosActivos: number;
    totalCursosActivos: number;
    totalProfesoresActivos: number;
    inscripcionesActivas: number;
  };
  graficos: {
    inscripcionesPorEstado: GraficoDataPoint[];
    alumnosPorCurso: GraficoDataPoint[];
  };
}