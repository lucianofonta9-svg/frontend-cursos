import { type IAlumno } from '../types/alumno.types.ts';
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
  IconButton
} from '@mui/material';
import DeleteIcon  from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ListaAlumnosProps {
  alumnos: IAlumno[];
  loading: boolean;
  error: string | null;
  onDelete: (legajoAlumno: number) => void;
  onEdit: (alumno: IAlumno) => void; // Cambiado a objeto completo
}

export function ListaAlumnos({ alumnos, loading, error, onDelete, onEdit }: ListaAlumnosProps) {

  if (loading) return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Lista de Alumnos
      </Typography>

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
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((alu) => (
              <TableRow key={alu.legajoAlumno}>
                <TableCell>{alu.legajoAlumno}</TableCell>
                <TableCell>{alu.nombre} {alu.apellido}</TableCell>
                <TableCell>{alu.email}</TableCell>
                <TableCell>{alu.dni}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(alu)} // Envia el objeto completo
                    title="Editar"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete" 
                    color="error"
                    onClick={() => onDelete(alu.legajoAlumno)}
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
