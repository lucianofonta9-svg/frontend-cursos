import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaAlumnos } from '../components/ListaAlumnos';
import { FormularioAlumno } from '../components/FormularioAlumno';
import { type IAlumno } from '../types/alumno.types';

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

interface GestionAlumnosViewProps {
  alumnos: IAlumno[];
  loading: boolean;
  error: string | null;
  onAlumnoCreado: () => void;
  onDeleteAlumno: (legajo: number) => void;
}

export const GestionAlumnosView = ({
  alumnos,
  loading,
  error,
  onAlumnoCreado,
  onDeleteAlumno,
}: GestionAlumnosViewProps) => {
  const [open, setOpen] = useState(false);
  const [alumnoEdit, setAlumnoEdit] = useState<IAlumno | null>(null);

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

      <ListaAlumnos
        alumnos={alumnos}
        loading={loading}
        error={error}
        onDelete={onDeleteAlumno}
        onEdit={handleOpenEditar} // Pasamos la función que abre el modal
      />

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

