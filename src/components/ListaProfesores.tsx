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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// ✅ Interfaz de props corregida
interface ListaProfesoresProps {
  profesores: IProfesor[];
  loading: boolean;
  error: string | null;
  onDelete: (legajoProfesor: number) => void;
  onEdit: (profesor: IProfesor) => void;
}

// ✅ Componente funcional
export function ListaProfesores({
  profesores,
  loading,
  error,
  onDelete,
  onEdit,
}: ListaProfesoresProps) {
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
        <Typography sx={{ padding: 2 }}>
          No hay profesores activos para mostrar.
        </Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Legajo</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((prof) => (
              <TableRow key={prof.legajoProfesor}>
                <TableCell>{prof.legajoProfesor}</TableCell>
                <TableCell>
                  {prof.nombre} {prof.apellido}
                </TableCell>
                <TableCell>{prof.email}</TableCell>
                <TableCell>{prof.dni}</TableCell>

                {/* 🔹 Botones de acción */}
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => onEdit(prof)} // 🔹 Llama al handler pasado por props
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => onDelete(prof.legajoProfesor)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
