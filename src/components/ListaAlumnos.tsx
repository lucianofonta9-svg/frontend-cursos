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
  IconButton,
  Chip // <-- 1. IMPORTADO
} from '@mui/material';
import DeleteIcon  from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore'; // <-- 2. IMPORTADO (para reactivar)

interface ListaAlumnosProps {
  alumnos: IAlumno[];
  loading: boolean;
  error: string | null;
  // 3. RENOMBRADO por claridad
  onDeactivate: (legajoAlumno: number) => void; 
  onEdit: (alumno: IAlumno) => void;
  // 4. AÑADIDO para la nueva función
  onReactivate: (legajoAlumno: number) => void; 
}

export function ListaAlumnos({ 
  alumnos, 
  loading, 
  error, 
  onDeactivate, // <-- Prop actualizada
  onEdit,
  onReactivate  // <-- Prop nueva
}: ListaAlumnosProps) {

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
              {/* 5. NUEVA COLUMNA DE ESTADO */}
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((alu) => (
              // 6. ESTILO CONDICIONAL PARA LA FILA
              <TableRow 
                key={alu.legajoAlumno}
                sx={{ opacity: alu.activo ? 1 : 0.6 }} // <-- Más opaco si está inactivo
              >
                <TableCell>{alu.legajoAlumno}</TableCell>
                <TableCell>{alu.nombre} {alu.apellido}</TableCell>
                <TableCell>{alu.email}</TableCell>
                <TableCell>{alu.dni}</TableCell>
                {/* 7. CELDA DE ESTADO CON CHIP */}
                <TableCell>
                  <Chip 
                    label={alu.activo ? "Activo" : "Inactivo"}
                    color={alu.activo ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {/* 8. LÓGICA CONDICIONAL PARA BOTONES */}
                  {alu.activo ? (
                    <>
                      {/* Botón Editar (solo si está activo) */}
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(alu)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      {/* Botón Desactivar (antes 'onDelete') */}
                      <IconButton 
                        aria-label="deactivate" 
                        color="error"
                        onClick={() => onDeactivate(alu.legajoAlumno)}
                        title="Desactivar"
                      >
                        <DeleteIcon /> 
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {/* Botón Reactivar (solo si está inactivo) */}
                      <IconButton 
                        aria-label="reactivate" 
                        color="success" // <-- Color verde
                        onClick={() => onReactivate(alu.legajoAlumno)}
                        title="Reactivar"
                      >
                        <RestoreIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}