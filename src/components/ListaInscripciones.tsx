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


interface ListaInscripcionesProps {
  inscripciones: IInscripcion[];
  loading: boolean;
  error: string | null;
  onEstadoCambiado?: (id?: number, nuevoEstado?: string) => void;
  onDeactivate: (id: number) => void; 
}

// Función auxiliar para el color del Chip de estado 
const getStatusColor = (estado: EstadoInscripcion): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
  switch (estado) {
    case 'INSCRITO': return 'default';
    case 'ACTIVO': return 'primary';
    case 'COMPLETADO': return 'success';
    case 'RETIRADO': return 'error';
    default: return 'default';
  }
};

interface InscripcionRowProps {
    insc: IInscripcion;
    handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>, insc: IInscripcion) => void;
    handleOpenModal: (insc: IInscripcion) => void;
    openRowId: number | null;
    handleToggleRow: (id: number) => void;
    onDeactivateClick: (id: number) => void; 
}

function InscripcionRow({ insc, handleMenuClick, handleOpenModal, openRowId, handleToggleRow, onDeactivateClick }: InscripcionRowProps) { 
  const isRowOpen = insc.id === openRowId;
  const hasNotes = insc.notas && insc.notas.length > 0;

  // --- LÓGICA DE INHABILITACIÓN 
  const alumnoInactivo = !insc.alumno.activo;
  const cursoInactivo = !insc.curso.activo; 
  
  // El botón de estado se deshabilita si el alumno O el curso están inactivos
  const deshabilitarBotonEstado = alumnoInactivo || cursoInactivo; 

  // Condición de inhabilitación para Añadir Nota
  const deshabilitarNota = insc.estado === 'COMPLETADO' || insc.estado === 'RETIRADO';
  
  // Condición de inhabilitación para Retirar Inscripción 
  const puedeRetirarse = insc.estado !== 'COMPLETADO' && insc.estado !== 'RETIRADO'; 
  // ------------------------------------------------------------------

  return (
    <>
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

                <Button 
                    onClick={(e) => handleMenuClick(e, insc)} 
                    variant="outlined" 
                    size="small" 
                    title={deshabilitarBotonEstado ? "Inactivo: Alumno o Curso dados de baja" : "Cambiar Estado"}
                    disabled={deshabilitarBotonEstado} 
                >
                    Cambiar Estado
                </Button>

                {/* --- AÑADIR NOTA:  --- */}
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
                
                {/* --- BOTÓN DAR DE BAJA INSCRIPCIÓN: --- */}
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

      {/* Fila Expandible con Notas */}
      {/* Fila Expandible con Notas */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}> {/* Colspan 5 */}
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
             <Box sx={{ margin: 2, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detalle de Notas</Typography>
              {!hasNotes ? (
                 <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>No hay notas registradas.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      <TableCell>Evaluación</TableCell>
                      <TableCell align="right">Calificación</TableCell>
                      <TableCell>Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insc.notas?.map((nota: INota) => (
                      <TableRow key={nota.id}>
                        <TableCell>{nota.nombreEvaluacion}</TableCell>
                        <TableCell align="right">
                          <Chip label={Number(nota.calificacion).toFixed(2)} color={Number(nota.calificacion) >= 6 ? 'primary' : 'warning'} size="small"/>
                        </TableCell>
                        <TableCell>{new Date(nota.fechaRegistro).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
    // Si el alumno O el curso están inactivos, no abrimos el menú
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

      // Chequeo final de seguridad antes de la API
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

              {inscripciones.map((insc) => (
                <InscripcionRow
                  key={insc.id}
                  insc={insc}
                  handleMenuClick={handleMenuClick}
                  handleOpenModal={handleOpenModal}
                  openRowId={openRowId}
                  handleToggleRow={handleToggleRow}
                  onDeactivateClick={onDeactivate} // 
                />
              ))}
            </TableBody>
          </Table>
        )}

        {/* Menú de Opciones de Estado */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleEstadoUpdate('ACTIVO')}>ACTIVO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('COMPLETADO')}>COMPLETADO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('RETIRADO')}>RETIRADO</MenuItem>
        </Menu>
      </TableContainer>

      {/* MODAL DE REGISTRO DE NOTAS */}
      <FormularioNotaModal
          inscripcion={inscripcionSeleccionada}
          open={modalOpen}
          onClose={handleCloseModal}
          onNotaRegistrada={handleNotaRegistrada}
      />
    </>
  );
}