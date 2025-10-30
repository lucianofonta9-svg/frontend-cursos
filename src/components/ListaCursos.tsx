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
  Chip,
  IconButton // <--- NUEVO: Para el botón de ícono
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit';

// 1. Añadimos la función onDelete a las props
interface ListaCursosProps {
  cursos: ICurso[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void; 
  onEdit: (id: number) => void; 
}

// 2. Recibimos la prop onDelete
export function ListaCursos({ cursos, loading, error, onDelete, onEdit}: ListaCursosProps) {

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
              <TableCell align="right">Acciones</TableCell> {/* 3. NUEVA COLUMNA */}
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{curso.duracion}</TableCell>
                <TableCell>
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
                {/* 4. NUEVA CELDA CON EL BOTÓN */}
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => onEdit && onEdit(curso.id)} // Llama a la función onEdit si existe
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => onDelete(curso.id)} // Llama a la función onDelete con el ID del curso
                  >
                    <DeleteIcon /> {/* Ícono del tachito */}
                  </IconButton>
                  {/* Aquí podrías añadir un botón de Editar en el futuro */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}