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
  Chip // <-- 1. IMPORTADO
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore'; // <-- 2. IMPORTADO

// --- 3. INTERFAZ DE PROPS ACTUALIZADA ---
interface ListaProfesoresProps {
  profesores: IProfesor[];
  loading: boolean;
  error: string | null;
  onDeactivate: (legajoProfesor: number) => void; // Prop renombrada
  onEdit: (profesor: IProfesor) => void;
  onReactivate: (legajoProfesor: number) => void; // Prop nueva
}

export function ListaProfesores({
  profesores,
  loading,
  error,
  // --- 4. PROPS DESTRUCTURADAS ACTUALIZADAS ---
  onDeactivate,
  onEdit,
  onReactivate,
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
          {/* 5. TEXTO ACTUALIZADO */}
          No hay profesores para mostrar.
        </Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Legajo</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
              {/* 6. NUEVA COLUMNA DE ESTADO */}
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((prof) => (
              // 7. ESTILO CONDICIONAL PARA LA FILA
              <TableRow 
                key={prof.legajoProfesor}
                sx={{ opacity: prof.activo ? 1 : 0.6 }} // <-- Más opaco si está inactivo
              >
                <TableCell>{prof.legajoProfesor}</TableCell>
                <TableCell>
                  {prof.nombre} {prof.apellido}
                </TableCell>
                <TableCell>{prof.email}</TableCell>
                <TableCell>{prof.dni}</TableCell>

                {/* 8. CELDA DE ESTADO CON CHIP */}
                <TableCell>
                  <Chip 
                    label={prof.activo ? "Activo" : "Inactivo"}
                    color={prof.activo ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                {/* 9. LÓGICA CONDICIONAL PARA BOTONES */}
                <TableCell align="right">
                  {prof.activo ? (
                    <>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => onEdit(prof)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="deactivate"
                        color="error"
                        onClick={() => onDeactivate(prof.legajoProfesor)}
                        title="Desactivar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="reactivate"
                      color="success"
                      onClick={() => onReactivate(prof.legajoProfesor)}
                      title="Reactivar"
                    >
                      <RestoreIcon />
                    </IconButton>
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