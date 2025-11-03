import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaAlumnos } from '../components/ListaAlumnos';
import { FormularioAlumno } from '../components/FormularioAlumno';
import { type IAlumno } from '../types/alumno.types';
import { GenericSearchFilter } from '../components/FiltradoGenerico';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

// --- CAMBIO 1: Se actualiza la interfaz de Props ---
interface GestionAlumnosViewProps {
  alumnos: IAlumno[];
  loading: boolean;
  error: string | null;
  onAlumnoCreado: () => void;
  onDeactivateAlumno: (legajo: number) => void; // Prop renombrada
  onReactivateAlumno: (legajo: number) => void; // Prop nueva
}

export const GestionAlumnosView = ({
  alumnos,
  loading,
  error,
  onAlumnoCreado,
  // --- CAMBIO 2: Se desestructuran las props actualizadas ---
  onDeactivateAlumno,
  onReactivateAlumno,
}: GestionAlumnosViewProps) => {
  const [open, setOpen] = useState(false);
  const [alumnoEdit, setAlumnoEdit] = useState<IAlumno | null>(null);

  // 🔹 Estado para alumnos filtrados
  const [alumnosFiltrados, setAlumnosFiltrados] = useState<IAlumno[]>(alumnos);

  // 🔹 Actualizar filtrados si cambia la lista original
  useEffect(() => {
    setAlumnosFiltrados(alumnos);
  }, [alumnos]);

  const handleClose = () => {
    setOpen(false);
    setAlumnoEdit(null);
  };

  const handleOpenCrear = () => {
    setAlumnoEdit(null);
    setOpen(true);
  };

  const handleOpenEditar = (alumno: IAlumno) => {
    setAlumnoEdit(alumno);
    setOpen(true);
  };

  const handleFormSubmit = () => {
    onAlumnoCreado();
    handleClose();
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Alumnos</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenCrear}>
          Crear Alumno
        </Button>
      </Box>

      {/* 🔹 Componente de búsqueda genérico */}
      <GenericSearchFilter
        data={alumnos}
        keys={['nombre', 'apellido']}
        onFiltered={setAlumnosFiltrados}
        placeholder="Buscar alumnos..."
      />

      {/* --- CAMBIO 3: Se actualizan las props pasadas a ListaAlumnos --- */}
      <ListaAlumnos
        alumnos={alumnosFiltrados}
        loading={loading}
        error={error}
        onDeactivate={onDeactivateAlumno} // Prop renombrada
        onEdit={handleOpenEditar}
        onReactivate={onReactivateAlumno} // Prop nueva
      />

      {/* Modal para crear/editar alumno */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            {alumnoEdit ? 'Editar Alumno' : 'Crear Nuevo Alumno'}
          </Typography>

         <FormularioAlumno
            onAlumnoCreado={handleFormSubmit}
            onRequestClose={handleClose}
            alumnoToEdit={alumnoEdit}
          />
        </Box>
      </Modal>
    </Box>
  );
};