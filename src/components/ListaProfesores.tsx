// Quita useState y useEffect de aquí
import { type IProfesor } from '../types/profesor.types.ts';
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
  IconButton // <--- NUEVO: Para el botón de ícono
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // <--- NUEVO: Ícono del tachito

// 1. Añadimos la función onDelete a las props
interface ListaProfesoresProps {
  profesores: IProfesor[];
  loading: boolean;
  error: string | null;
  onDelete: (legajoProfesor: number) => void; // Función para manejar la eliminación
}

// 2. Recibimos la prop onDelete
export function ListaProfesores({ profesores, loading, error, onDelete }: ListaProfesoresProps) {

  if (loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Lista de Profesores
      </Typography>

      {profesores.length === 0 ? (
        <Typography sx={{ padding: 2 }}>No hay profesores activos para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Legajo</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell align="right">Acciones</TableCell> {/* 3. NUEVA COLUMNA */}
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((prof) => (
              <TableRow key={prof.legajoProfesor}>
                <TableCell>{prof.legajoProfesor}</TableCell>
                <TableCell>{prof.nombre} {prof.apellido}</TableCell>
                <TableCell>{prof.email}</TableCell>
                <TableCell>{prof.dni}</TableCell>
                {/* 4. NUEVA CELDA CON EL BOTÓN */}
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => onDelete(prof.legajoProfesor)} // Llama a la función onDelete con el legajo
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