import { useState } from 'react'; 
import { type IInscripcion, type EstadoInscripcion } from '../types/inscripcion.types.ts';
import { type INota } from '../types/nota.types.ts'; 
import apiClient from '../apiService';
import { 
  Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Chip, Button, Menu, MenuItem,
  Collapse, Box // Elementos para la fila expandible
} from '@mui/material';
import { FormularioNotaModal } from './FormularioNotaModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'; // Ícono para "Ver"

// Definimos las props que recibe el componente
interface ListaInscripcionesProps {
  inscripciones: IInscripcion[]; 
  loading: boolean;
  error: string | null;
  onEstadoCambiado: () => void;
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

// Componente de Fila Expandible para la Inscripción
function InscripcionRow({ insc, handleMenuClick, handleOpenModal, openRowId, handleEstadoUpdate, getStatusColor, handleToggleRow }: {
    insc: IInscripcion,
    handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>, insc: IInscripcion) => void,
    handleOpenModal: (insc: IInscripcion) => void,
    openRowId: number | null,
    handleToggleRow: (id: number) => void, // 👈 Ahora recibe la función del padre
    handleEstadoUpdate: (nuevoEstado: EstadoInscripcion) => void,
    getStatusColor: (estado: EstadoInscripcion) => 'default' | 'primary' | 'success' | 'error' | 'warning'
}) {

  const isRowOpen = insc.id === openRowId;
  const hasNotes = insc.notas && insc.notas.length > 0;

  return (
    <>
      {/* 1. FILA PRINCIPAL */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        
        <TableCell>{insc.id}</TableCell>
        <TableCell>{insc.alumno.nombre} {insc.alumno.apellido}</TableCell>
        <TableCell>{insc.curso.nombre}</TableCell>
        <TableCell>
          <Chip 
            label={insc.estado} 
            color={getStatusColor(insc.estado)} 
          />
        </TableCell>
        
        {/* NUEVA CELDA DE ACCIONES */}
        <TableCell>
             {/* 1. Botón de Ver Notas/Detalles */}
            <Button 
                onClick={() => handleToggleRow(insc.id)} // 👈 Llama a la función de expansión
                variant="outlined"
                size="small"
                startIcon={<RemoveRedEyeIcon />}
                disabled={!hasNotes} // Deshabilita si no hay notas
            >
                {isRowOpen ? 'Ocultar Notas' : 'Ver Notas'}
            </Button>
            
            {/* 2. Botón de Cambiar Estado */}
            <Button 
                onClick={(e) => handleMenuClick(e, insc)}
                variant="outlined"
                size="small"
                sx={{ ml: 1, mr: 1 }} 
            >
                Cambiar Estado
            </Button>
            
            {/* 3. Botón para Registrar Nota */}
            <Button 
                onClick={() => handleOpenModal(insc)}
                variant="contained"
                size="small"
                color="success"
                disabled={insc.estado === 'COMPLETADO' || insc.estado === 'RETIRADO'} 
            >
                Registrar Nota
            </Button>
        </TableCell>
      </TableRow>

      {/* 2. FILA EXPANDIBLE CON NOTAS */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}> {/* Cambiado Colspan a 5 para ajustarse a las celdas visibles */}
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de Notas
              </Typography>
              {!hasNotes ? (
                 <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                    No hay notas registradas para esta inscripción.
                 </Typography>
              ) : (
                <Table size="small" aria-label="notas">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      <TableCell>Evaluación</TableCell>
                      <TableCell align="right">Calificación</TableCell>
                      <TableCell>Fecha Registro</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insc.notas?.map((nota: INota) => ( // <--- CORRECCIÓN CLAVE: Usamos '?' aquí
                      <TableRow key={nota.id}>
                        <TableCell component="th" scope="row">
                          {nota.nombreEvaluacion}
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={Number(nota.calificacion).toFixed(2)} 
                            color={Number(nota.calificacion) >= 6 ? 'primary' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(nota.fechaRegistro).toLocaleDateString()}
                        </TableCell>
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


export function ListaInscripciones({ inscripciones, loading, error, onEstadoCambiado }: ListaInscripcionesProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<IInscripcion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [openRowId, setOpenRowId] = useState<number | null>(null); // ✅ Estado correcto

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, inscripcion: IInscripcion) => {
    setAnchorEl(event.currentTarget);
    setInscripcionSeleccionada(inscripcion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEstadoUpdate = async (nuevoEstado: EstadoInscripcion) => {
    if (!inscripcionSeleccionada) return;

    try {
        await apiClient.patch(`/inscripciones/${inscripcionSeleccionada.id}`, {
            estado: nuevoEstado
        });

        handleMenuClose();
        onEstadoCambiado(); 
    } catch (err) {
        console.error('Error al cambiar el estado:', err);
    }
  };

  const handleOpenModal = (inscripcion: IInscripcion) => {
    setInscripcionSeleccionada(inscripcion); 
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setInscripcionSeleccionada(null);
  };
  
  const handleNotaRegistrada = () => {
      onEstadoCambiado(); 
  }
  
  // ✅ FUNCIÓN CORREGIDA: NUNCA DEBE LLAMARSE 'setOpenRowId'
  const handleToggleRow = (id: number) => {
    // Si la ID actual es la que se pide, la cerramos (null); si no, la abrimos (id)
    setOpenRowId(id === openRowId ? null : id); 
  };


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Lista de Inscripciones (Alumnos por Curso)
      </Typography>

      {inscripciones.length === 0 ? (
        <Typography sx={{ padding: 2 }}>No hay inscripciones para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Mapea sobre las inscripciones usando el componente de fila */}
            {inscripciones.map((insc) => (
              <InscripcionRow
                key={insc.id}
                insc={insc}
                handleMenuClick={handleMenuClick}
                handleOpenModal={handleOpenModal}
                handleEstadoUpdate={handleEstadoUpdate}
                getStatusColor={getStatusColor}
                openRowId={openRowId} // Pasa el ID de la fila abierta
                handleToggleRow={handleToggleRow} // 👈 Pasa la función corregida
              />
            ))}
          </TableBody>
        </Table>
      )}

      {/* Menú de Opciones de Estado (Mantenido) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
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
