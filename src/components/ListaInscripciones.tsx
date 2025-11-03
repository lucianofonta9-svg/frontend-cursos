import { useState } from 'react';
import { type IInscripcion, type EstadoInscripcion } from '../types/inscripcion.types.ts';
import { type INota } from '../types/nota.types.ts';
import apiClient from '../apiService';
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Chip, Button, Menu, MenuItem,
  Collapse, Box, IconButton 
} from '@mui/material';
import { FormularioNotaModal } from './FormularioNotaModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete'; 

// --- 1. PROPS ACTUALIZADAS ---
// (Renombramos 'onDelete' a 'onDeactivate' para claridad)
interface ListaInscripcionesProps {
  inscripciones: IInscripcion[];
  loading: boolean;
  error: string | null;
  onEstadoCambiado?: (id?: number, nuevoEstado?: string) => void;
  onDeactivate: (id: number) => void; // Prop renombrada
}

// Función auxiliar para el color del Chip de estado (Sin cambios)
const getStatusColor = (estado: EstadoInscripcion): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
  switch (estado) {
    case 'INSCRITO': return 'default';
    case 'ACTIVO': return 'primary';
    case 'COMPLETADO': return 'success';
    case 'RETIRADO': return 'error';
    default: return 'default';
  }
};

// --- 2. PROPS DE FILA ACTUALIZADAS ---
// (Renombramos 'handleDeleteClick' a 'onDeactivateClick' para claridad)
interface InscripcionRowProps {
    insc: IInscripcion;
    handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>, insc: IInscripcion) => void;
    handleOpenModal: (insc: IInscripcion) => void;
    openRowId: number | null;
    handleToggleRow: (id: number) => void;
    onDeactivateClick: (id: number) => void; // Prop renombrada
}

function InscripcionRow({ insc, handleMenuClick, handleOpenModal, openRowId, handleToggleRow, onDeactivateClick }: InscripcionRowProps) { 
  const isRowOpen = insc.id === openRowId;
  const hasNotes = insc.notas && insc.notas.length > 0;

  return (
    <>
      {/* Fila Principal */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {/* ... (Celdas de ID, Alumno, Curso, Estado sin cambios) ... */}
        <TableCell>{insc.id}</TableCell>
        <TableCell>{insc.alumno.nombre} {insc.alumno.apellido}</TableCell>
        <TableCell>{insc.curso.nombre}</TableCell>
        <TableCell>
          <Chip label={insc.estado} color={getStatusColor(insc.estado)}  size="small"
                    variant="outlined" />
        </TableCell>
        <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 0.5 }}>
            {/* ... (Botones de Ver Notas, Cambiar Estado, Nota sin cambios) ... */}
                <Button onClick={() => handleToggleRow(insc.id)} variant="outlined" size="small" startIcon={<RemoveRedEyeIcon />} disabled={!hasNotes} title="Ver/Ocultar Notas">
                    {isRowOpen ? 'Ocultar' : 'Ver'} Notas
                </Button>
                <Button onClick={(e) => handleMenuClick(e, insc)} variant="outlined" size="small" title="Cambiar Estado">
                    Cambiar Estado
                </Button>
                <Button onClick={() => handleOpenModal(insc)} variant="contained" size="small" color="success" disabled={insc.estado === 'COMPLETADO' || insc.estado === 'RETIRADO'} title="Registrar Nota">
                    Añadir Nota
                </Button>
                
                {/* --- 3. BOTÓN ELIMINAR ACTUALIZADO --- */}
            {/* (Ahora solo llama a la prop, sin 'window.confirm') */}
                <IconButton aria-label="delete" color="error" size="small" onClick={() => onDeactivateClick(insc.id)} title="Retirar Inscripción">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </TableCell>
      </TableRow>

      {/* Fila Expandible con Notas (Sin cambios) */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>








<Box sx={{ margin: 1, padding: 2, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom component="div">
                  Notas Registradas
                </Typography>
                
                {hasNotes ? (
                  <Table size="small" aria-label="notas">
                    <TableHead>
                     <TableRow>
                        <TableCell>ID Nota</TableCell>
                        <TableCell>Evaluación</TableCell>
                        <TableCell>Calificación</TableCell>
                        <TableCell>Fecha Registro</TableCell>
                     </TableRow>
                    </TableHead>
                    <TableBody>
                    {/* Hacemos el map sobre 'insc.notas' */}
                      {insc.notas?.map((nota: INota) => (
                        <TableRow key={nota.id}>
                          <TableCell>{nota.id}</TableCell>
                          <TableCell>{nota.nombreEvaluacion}</TableCell>
                          <TableCell>{nota.calificacion}</TableCell>
                          <TableCell>{new Date(nota.fechaRegistro).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>No hay notas para mostrar.</Typography>
                )}
              </Box>









            </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ---------------------------------------------------------
// Componente Principal (ListaInscripciones)
// ---------------------------------------------------------
// --- 4. PROPS DESTRUCTURADAS ACTUALIZADAS ---
export function ListaInscripciones({ inscripciones, loading, error, onEstadoCambiado, onDeactivate }: ListaInscripcionesProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<IInscripcion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  // --- Handlers (Sin cambios) ---
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, inscripcion: IInscripcion) => {
      setAnchorEl(event.currentTarget);
      setInscripcionSeleccionada(inscripcion);
  };
  const handleMenuClose = () => { setAnchorEl(null); };
  const handleEstadoUpdate = async (nuevoEstado: EstadoInscripcion) => {
      if (!inscripcionSeleccionada) return;
      try {
          await apiClient.patch(`/inscripciones/${inscripcionSeleccionada.id}`, { estado: nuevoEstado });
          handleMenuClose();
          onEstadoCambiado?.(inscripcionSeleccionada.id, nuevoEstado);
      } catch (err) { console.error('Error al cambiar el estado:', err); }
  };
  const handleOpenModal = (inscripcion: IInscripcion) => { setInscripcionSeleccionada(inscripcion); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setInscripcionSeleccionada(null); };
  const handleNotaRegistrada = () => { onEstadoCambiado?.(); };
  const handleToggleRow = (id: number) => { setOpenRowId(id === openRowId ? null : id); };

  // --- 5. FUNCIÓN 'handleDeleteClick' ELIMINADA ---
  // (La lógica de confirmación ahora vivirá en App.tsx)

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Typography variant="h5" component="h2" sx={{ padding: 2 }}>Lista de Inscripciones</Typography>

        {inscripciones.length === 0 ? (
          <Typography sx={{ padding: 2 }}>No hay inscripciones.</Typography>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>ID</TableCell>
                <TableCell>Alumno</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* --- 6. PROP ACTUALIZADA PASADA A LA FILA --- */}
              {inscripciones.map((insc) => (
                <InscripcionRow
                  key={insc.id}
                  insc={insc}
                  handleMenuClick={handleMenuClick}
                  handleOpenModal={handleOpenModal}
                  openRowId={openRowId}
                  handleToggleRow={handleToggleRow}
                  onDeactivateClick={onDeactivate} // <-- Pasa 'onDeactivate' directamente
                />
              ))}
            </TableBody>
          </Table>
        )}

        {/* Menú de Opciones de Estado (Sin cambios) */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleEstadoUpdate('ACTIVO')}>Marcar como ACTIVO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('COMPLETADO')}>Marcar como COMPLETADO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('RETIRADO')}>Marcar como RETIRADO</MenuItem>
        </Menu>
      </TableContainer>

      {/* MODAL DE REGISTRO DE NOTAS (Sin cambios) */}
      <FormularioNotaModal
          inscripcion={inscripcionSeleccionada}
          open={modalOpen}
          onClose={handleCloseModal}
          onNotaRegistrada={handleNotaRegistrada}
      />
    </>
  );
}