import { useState } from 'react';
import { type IInscripcion, type EstadoInscripcion } from '../types/inscripcion.types.ts';
import { type INota } from '../types/nota.types.ts';
import apiClient from '../apiService';
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Chip, Button, Menu, MenuItem,
  Collapse, Box, IconButton // Añadido IconButton
} from '@mui/material';
import { FormularioNotaModal } from './FormularioNotaModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete'; // Añadido ícono eliminar

// 1. Añadimos la función onDelete a las props
interface ListaInscripcionesProps {
  inscripciones: IInscripcion[];
  loading: boolean;
  error: string | null;
  onEstadoCambiado?: (id?: number, nuevoEstado?: string) => void;
  onDelete: (id: number) => void; // Función para manejar la eliminación
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

// 2. Componente de Fila: Añadir handleDeleteClick a las props
interface InscripcionRowProps {
    insc: IInscripcion;
    handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>, insc: IInscripcion) => void;
    handleOpenModal: (insc: IInscripcion) => void;
    openRowId: number | null;
    handleToggleRow: (id: number) => void;
    handleDeleteClick: (id: number) => void; // Recibe la función de clic para eliminar
    // No necesitamos pasar handleEstadoUpdate ni getStatusColor
}

function InscripcionRow({ insc, handleMenuClick, handleOpenModal, openRowId, handleToggleRow, handleDeleteClick }: InscripcionRowProps) { // Recibe handleDeleteClick
  const isRowOpen = insc.id === openRowId;
  const hasNotes = insc.notas && insc.notas.length > 0;

  return (
    <>
      {/* Fila Principal */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{insc.id}</TableCell>
        <TableCell>{insc.alumno.nombre} {insc.alumno.apellido}</TableCell>
        <TableCell>{insc.curso.nombre}</TableCell>
        <TableCell>
          <Chip label={insc.estado} color={getStatusColor(insc.estado)} />
        </TableCell>
        {/* Celda de Acciones */}
        <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 0.5 }}>
                <Button onClick={() => handleToggleRow(insc.id)} variant="outlined" size="small" startIcon={<RemoveRedEyeIcon />} disabled={!hasNotes} title="Ver/Ocultar Notas">
                    {isRowOpen ? 'Ocultar' : 'Ver'} Notas
                </Button>
                <Button onClick={(e) => handleMenuClick(e, insc)} variant="outlined" size="small" title="Cambiar Estado">
                    Cambiar Estado
                </Button>
                <Button onClick={() => handleOpenModal(insc)} variant="contained" size="small" color="success" disabled={insc.estado === 'COMPLETADO' || insc.estado === 'RETIRADO'} title="Registrar Nota">
                    Nota
                </Button>
                {/* 3. BOTÓN ELIMINAR */}
                <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDeleteClick(insc.id)} title="Eliminar Inscripción">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </TableCell>
      </TableRow>

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
// 4. Recibe la prop onDelete
export function ListaInscripciones({ inscripciones, loading, error, onEstadoCambiado, onDelete }: ListaInscripcionesProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<IInscripcion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  // --- Handlers ---
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

  // 5. Función handleDeleteClick (con confirmación)
  const handleDeleteClick = (id: number) => {
      if (window.confirm(`¿Estás seguro de eliminar la inscripción ${id}? Esta acción es permanente y borrará las notas asociadas.`)) {
          onDelete(id); // Llama a la función onDelete pasada desde App.tsx
      }
  };

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
              {/* Pasa handleDeleteClick a InscripcionRow */}
              {inscripciones.map((insc) => (
                <InscripcionRow
                  key={insc.id}
                  insc={insc}
                  handleMenuClick={handleMenuClick}
                  handleOpenModal={handleOpenModal}
                  // handleEstadoUpdate se llama desde el Menu
                  // getStatusColor se llama desde el Chip
                  openRowId={openRowId}
                  handleToggleRow={handleToggleRow}
                  handleDeleteClick={handleDeleteClick} // <--- PASA LA FUNCIÓN DE CLIC
                />
              ))}
            </TableBody>
          </Table>
        )}

        {/* Menú de Opciones de Estado */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleEstadoUpdate('ACTIVO')}>Marcar como ACTIVO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('COMPLETADO')}>Marcar como COMPLETADO</MenuItem>
          <MenuItem onClick={() => handleEstadoUpdate('RETIRADO')}>Marcar como RETIRADO</MenuItem>
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