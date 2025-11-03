import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import { type IInscripcion } from '../types/inscripcion.types';
import { type DashboardStats } from '../types/dashboard.types'; 
import { 
    Box, Typography, Paper, 
    CircularProgress, Alert 
} from '@mui/material'; 
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ListaInscripciones } from '../components/ListaInscripciones';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import type { ICurso } from '../types/curso.types';
import type { IProfesor } from '../types/profesor.types';
import type { IAlumno } from '../types/alumno.types';

interface KpiCardProps {
  title: string;
  value: number | string;
}
function KpiCard({ title, value }: KpiCardProps) {
  return (
    <Paper 
      elevation={3} 
      sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
    >
      <Typography variant="h6" color="text.secondary" align="center">{title}</Typography>
      <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Paper>
  );
}


const PIE_COLORS: { [key: string]: string } = {
  ACTIVO: '#1976d2',
  INSCRITO: '#9c27b0',
  COMPLETADO: '#2e7d32',
  RETIRADO: '#d32f2f',
  DEFAULT: '#8884d8', 
};


interface DashboardViewProps {
  inscripciones: IInscripcion[];
  loadingInscripciones: boolean;
  errorInscripciones: string | null;
profesores: IProfesor[]; 
    alumnos: IAlumno[];    
    cursos: ICurso[];


  onEstadoCambiado?: (id?: number, nuevoEstado?: string) => void;
  onDeleteInscripcion: (id: number) => void; 
  
}


export const DashboardView = ({
  inscripciones,
  loadingInscripciones,
  errorInscripciones,
  onEstadoCambiado,
  onDeleteInscripcion, 
}: DashboardViewProps) => {

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setErrorStats(null);
        const response = await apiClient.get<DashboardStats>('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setErrorStats('No se pudieron cargar las estadísticas. Revise la conexión con el backend.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []); 

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Panel de Control
      </Typography>

      {/* --- SECCIÓN DE KPIs --- */}
      {loadingStats ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : errorStats ? (
        <Alert severity="error">{errorStats}</Alert>
      ) : stats && (
        <>
          <Box sx={{ mb: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                flexGrow: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <PersonIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Profesores Activos: {stats.kpis.totalProfesoresActivos}</Typography>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                flexGrow: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <SchoolIcon color="secondary" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Cursos Activos: {stats.kpis.totalCursosActivos}</Typography>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                flexGrow: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <PeopleIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Alumnos Activos: {stats.kpis.totalAlumnosActivos}</Typography>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                flexGrow: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ArticleIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h6">Inscrip. Activas: {stats.kpis.inscripcionesActivas}</Typography>
            </Paper>
          </Box>

          {/* --- SECCIÓN DE GRÁFICOS --- */}

          <Box display="flex" flexWrap="wrap" sx={{ mb: 4, mx: -1.5 }}>

            {/* Box para el gráfico de barras */}

            <Box width={{ xs: 1, lg: 8/12 }} sx={{ p: 1.5, boxSizing: 'border-box' }}>
              <Paper sx={{ p: 2, height: { xs: 400, md: 500 } }}>
                <Typography variant="h6" gutterBottom align="center">Alumnos por Curso (Top 10 Activos)</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={stats.graficos.alumnosPorCurso} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} fontSize="0.8rem" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="value" fill="#1976d2" name="N° de Alumnos" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Box para el gráfico de torta */}
            
            <Box width={{ xs: 1, lg: 4/12 }} sx={{ p: 1.5, boxSizing: 'border-box' }}>
              <Paper sx={{ p: 2, height: { xs: 400, md: 500 } }}>
                <Typography variant="h6" gutterBottom align="center">Estado de Inscripciones</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie 
                      data={stats.graficos.inscripcionesPorEstado} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={120} 
                      labelLine={false}
                      label={(entry) => `${entry.name} (${entry.value})`}
                    >
                      {stats.graficos.inscripcionesPorEstado.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[entry.name] || PIE_COLORS.DEFAULT} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </Box>
        </>
      )}

      {/* --- SECCIÓN DE INSCRIPCIONES */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Últimas Inscripciones
      </Typography>
      <ListaInscripciones
        inscripciones={inscripciones}
        loading={loadingInscripciones}
        error={errorInscripciones}
        onEstadoCambiado={onEstadoCambiado}
      onDeactivate={onDeleteInscripcion} 
      />
    </Box>
  );
};