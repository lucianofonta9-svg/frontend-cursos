import { Box, Typography, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import { ListaInscripciones } from '../components/ListaInscripciones';

// --- VISTA: DASHBOARD ---
export const DashboardView = ({
  inscripciones,
  profesores,
  alumnos,
  cursos,
  loadingInscripciones,
  errorInscripciones,
  onEstadoCambiado,
  onDeleteInscripcion,
}: {
  inscripciones: any[];
  profesores: any[];
  alumnos: any[];
  cursos: any[];
  loadingInscripciones: boolean;
  errorInscripciones: any;
  onEstadoCambiado?: (id?: number, nuevoEstado?: string) => void; // ✅ parámetros opcionales
  onDeleteInscripcion: (id: number) => void;
}) => {
  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Panel de Control
      </Typography>

      {/* TARJETAS DE MÉTRICAS */}
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
          <Typography variant="h6">
            Profesores registrados: {profesores.length}
          </Typography>
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
          <Typography variant="h6">Cursos activos: {cursos.length}</Typography>
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
          <Typography variant="h6">
            Alumnos registrados: {alumnos.length}
          </Typography>
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
          <Typography variant="h6">
            Total Inscripciones: {inscripciones.length}
          </Typography>
        </Paper>
      </Box>

      {/* TABLA DE INSCRIPCIONES */}
      <Typography variant="h5" component="h2" gutterBottom>
        Últimas Inscripciones
      </Typography>

      <ListaInscripciones
        inscripciones={inscripciones}
        loading={loadingInscripciones}
        error={errorInscripciones}
        onEstadoCambiado={onEstadoCambiado}
        onDelete={onDeleteInscripcion}
      />
    </Box>
  );
};
