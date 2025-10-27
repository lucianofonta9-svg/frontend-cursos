import { type IAlumno } from '../types/alumno.types.ts'; // 1. Cambiado a tipo Alumno
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

// 2. Renombrada la interface de props
interface ListaAlumnosProps {
  alumnos: IAlumno[]; // 3. Cambiado a array de Alumno
  loading: boolean;
  error: string | null;
}

// 4. Renombrado el componente y las props recibidas
export function ListaAlumnos({ alumnos, loading, error }: ListaAlumnosProps) {

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
        Lista de Alumnos {/* 5. Cambiado el título */}
      </Typography>

      {/* 6. Cambiado el array a 'alumnos' */}
      {alumnos.length === 0 ? (
        <Typography sx={{ padding: 2 }}>No hay alumnos para mostrar.</Typography>
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
            {/* 7. Mapea sobre 'alumnos' */}
            {alumnos.map((alu) => (
              // 8. Usa 'legajoAlumno' como key y para mostrar
              <TableRow key={alu.legajoAlumno}>
                <TableCell>{alu.legajoAlumno}</TableCell>
                <TableCell>{alu.nombre} {alu.apellido}</TableCell>
                <TableCell>{alu.email}</TableCell>
                <TableCell>{alu.dni}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}