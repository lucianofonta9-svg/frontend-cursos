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
// (Sin cambios)
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
// (Sin cambios)
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

  // --- LÓGICA DE INHABILITACIÓN ACTUALIZADA ---
  const alumnoInactivo = !insc.alumno.activo;
  // AÑADIDO: Asumimos que la propiedad de curso activo existe
  const cursoInactivo = !insc.curso.activo; 
  
  // El botón de estado se deshabilita si el alumno O el curso están inactivos
  const deshabilitarBotonEstado = alumnoInactivo || cursoInactivo; 

  // Condición de inhabilitación para Añadir Nota (se mantiene la lógica original)
  const deshabilitarNota = insc.estado === 'COMPLETADO' || insc.estado === 'RETIRADO';
  
  // Condición de inhabilitación para Retirar Inscripción (se mantiene la lógica original)
  const puedeRetirarse = insc.estado !== 'COMPLETADO' && insc.estado !== 'RETIRADO'; 
  // ------------------------------------------------------------------

  return (
    <>
      {/* Fila Principal */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{insc.id}</TableCell>
        <TableCell>
            {insc.alumno.nombre} {insc.alumno.apellido}
            {alumnoInactivo && <Chip label="ALUMNO INACTIVO" color="error" size="small" variant="filled" sx={{ marginLeft: 1 }} />}
        </TableCell>
        <TableCell>
            {insc.curso.nombre}
            {cursoInactivo && <Chip label="CURSO INACTIVO" color="error" size="small" variant="filled" sx={{ marginLeft: 1 }} />}
        </TableCell>
        <TableCell>
          <Chip label={insc.estado} color={getStatusColor(insc.estado)}  size="small"
                    variant="outlined" />
        </TableCell>
        <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 0.5 }}>
                <Button onClick={() => handleToggleRow(insc.id)} variant="outlined" size="small" startIcon={<RemoveRedEyeIcon />} disabled={!hasNotes} title="Ver/Ocultar Notas">
                    {isRowOpen ? 'Ocultar' : 'Ver'} Notas
                </Button>

                {/* --- CAMBIO DE ESTADO: DESHABILITADO SI ALUMNO O CURSO INACTIVO --- */}
                <Button 
                    onClick={(e) => handleMenuClick(e, insc)} 
                    variant="outlined" 
                    size="small" 
                    title={deshabilitarBotonEstado ? "Inactivo: Alumno o Curso dados de baja" : "Cambiar Estado"}
                    disabled={deshabilitarBotonEstado} // <-- ¡Aplica la nueva lógica combinada!
                >
                    Cambiar Estado
                </Button>

                {/* --- AÑADIR NOTA: Usa lógica original --- */}
                <Button 
                    onClick={() => handleOpenModal(insc)} 
                    variant="contained" 
                    size="small" 
                    color="success" 
                    disabled={deshabilitarNota} 
                    title="Registrar Nota"
                >
                    Añadir Nota
                </Button>
                
                {/* --- BOTÓN RETIRAR: Usa lógica original --- */}
                <IconButton 
                    aria-label="delete" 
                    color="error" 
                    size="small" 
                    onClick={() => onDeactivateClick(insc.id)} 
                    title="Retirar Inscripción"
                    disabled={!puedeRetirarse} 
                >
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
export function ListaInscripciones({ inscripciones, loading, error, onEstadoCambiado, onDeactivate }: ListaInscripcionesProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<IInscripcion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  // --- Handlers ---
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, inscripcion: IInscripcion) => {
    // AÑADIDO: Si el alumno O el curso están inactivos, no abrimos el menú
      if (!inscripcion.alumno.activo || !inscripcion.curso.activo) { 
          console.warn('Operación bloqueada: Alumno o Curso inactivo.');
          return;
      }
      setAnchorEl(event.currentTarget);
      setInscripcionSeleccionada(inscripcion);
  };
  const handleMenuClose = () => { setAnchorEl(null); };
  const handleEstadoUpdate = async (nuevoEstado: EstadoInscripcion) => {
      if (!inscripcionSeleccionada) return;

      // AÑADIDO: Chequeo final de seguridad antes de la API
      if (!inscripcionSeleccionada.alumno.activo || !inscripcionSeleccionada.curso.activo) {
          alert('Error: No se puede cambiar el estado. El alumno o el curso están inactivos.');
          handleMenuClose();
          return;
      }

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