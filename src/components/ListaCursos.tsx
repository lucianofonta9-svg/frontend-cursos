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
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore'; // <-- 1. IMPORTADO

// --- 2. INTERFAZ DE PROPS ACTUALIZADA ---
interface ListaCursosProps {
  cursos: ICurso[];
  loading: boolean;
  error: string | null;
  onDeactivate: (id: number) => void; // Prop renombrada
  onEdit: (curso: ICurso) => void; // Cambiado a objeto completo por consistencia
  onReactivate: (id: number) => void; // Prop nueva
}

// --- 3. PROPS DESTRUCTURADAS ACTUALIZADAS ---
export function ListaCursos({ 
  cursos, 
  loading, 
  error, 
  onDeactivate, 
  onEdit, 
  onReactivate 
}: ListaCursosProps) {

  if (loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, marginBottom: 4 }}>
      {/* 4. TEXTO ACTUALIZADO */}
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Listado de Cursos
      </Typography>

      {cursos.length === 0 ? (
        // 5. TEXTO ACTUALIZADO
        <Typography sx={{ padding: 2 }}>No hay cursos para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Curso</TableCell>
              <TableCell>Duración (Hrs)</TableCell>
              <TableCell>Profesor Asignado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              // 6. ESTILO CONDICIONAL PARA LA FILA
              <TableRow 
                key={curso.id}
                sx={{ opacity: curso.activo ? 1 : 0.6 }} // <-- Más opaco si está inactivo
              >
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{curso.duracion}</TableCell>
                <TableCell>
                  {curso.profesor ? (
                    // Si el objeto Profesor existe (legajo NO es null)
                    `${curso.profesor.nombre} ${curso.profesor.apellido}`
                  ) : (
                    // Si el objeto Profesor es null (legajo ES null)
                    <Chip label="Sin Asignar" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={curso.activo ? "Activo" : "Inactivo"}
                    color={curso.activo ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                {/* 7. LÓGICA CONDICIONAL PARA BOTONES */}
                <TableCell align="right">
                  {curso.activo ? (
                    <>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => onEdit(curso)} // <-- Pasa el objeto completo
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deactivate"
                        color="error"
                        onClick={() => onDeactivate(curso.id)}
                        title="Desactivar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="reactivate"
                      color="success"
                      onClick={() => onReactivate(curso.id)}
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