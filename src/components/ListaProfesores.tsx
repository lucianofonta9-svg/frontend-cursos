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
  Alert 
} from '@mui/material';

// 1. Definimos las props que recibe el componente
interface ListaProfesoresProps {
  profesores: IProfesor[];
  loading: boolean;
  error: string | null;
}

// 2. Recibimos las props
export function ListaProfesores({ profesores, loading, error }: ListaProfesoresProps) {

  // La lógica de fetch ya no está aquí

  if (loading) {
    return <CircularProgress />;
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
        <Typography sx={{ padding: 2 }}>No hay profesores para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Legajo</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((prof) => (
              <TableRow key={prof.legajoProfesor}>
                <TableCell>{prof.legajoProfesor}</TableCell>
                <TableCell>{prof.nombre} {prof.apellido}</TableCell>
                <TableCell>{prof.email}</TableCell>
                <TableCell>{prof.dni}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}