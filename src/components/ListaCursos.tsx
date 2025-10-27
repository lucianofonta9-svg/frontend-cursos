import { type ICurso } from '../types/curso.types.ts';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Alert,
  Chip // Usaremos Chip para el estado activo
} from '@mui/material';

// 1. Definimos las props que recibe el componente
interface ListaCursosProps {
  cursos: ICurso[];
  loading: boolean;
  error: string | null;
  // Nota: No necesitamos una función de recarga, App.tsx ya lo maneja
}

export function ListaCursos({ cursos, loading, error }: ListaCursosProps) {

  if (loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Listado de Cursos Activos
      </Typography>

      {cursos.length === 0 ? (
        <Typography sx={{ padding: 2 }}>No hay cursos activos para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Duración (Hrs)</TableCell>
              <TableCell>Profesor Asignado</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{curso.duracion}</TableCell>
                <TableCell>
                  {/* Muestra el nombre completo del profesor si la relación está cargada */}
                  {curso.profesor ? 
                    `${curso.profesor.nombre} (Legajo: ${curso.profesorLegajo})` : 
                    `Legajo: ${curso.profesorLegajo}`}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={curso.activo ? "Activo" : "Inactivo"} 
                    color={curso.activo ? "success" : "error"} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}