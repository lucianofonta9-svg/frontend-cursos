import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaProfesores } from '../components/ListaProfesores';
import { FormularioProfesor } from '../components/FormularioProfesor';
import { type IProfesor } from '../types/profesor.types';

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

interface GestionProfesoresViewProps {
  profesores: IProfesor[];
  loading: boolean;
  error: string | null;
  onProfesorCreado: () => void;
  onDeleteProfesor: (legajo: number) => void;
  onEditProfesor: (profesor: IProfesor) => void;
}

export const GestionProfesoresView = ({
  profesores,
  loading,
  error,
  onProfesorCreado,
  onDeleteProfesor,
}: GestionProfesoresViewProps) => {
  const [open, setOpen] = useState(false);
  const [profesorEdit, setProfesorEdit] = useState<IProfesor | null>(null);

  const handleClose = () => {
    setOpen(false);
    setProfesorEdit(null);
  };

  const handleOpenCrear = () => {
    setProfesorEdit(null);
    setOpen(true);
  };

  const handleOpenEditar = (profesor: IProfesor) => {
    setProfesorEdit(profesor);
    setOpen(true);
  };

  const handleFormSubmit = () => {
    onProfesorCreado();
    handleClose();
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Profesores</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenCrear}>
          Crear Profesor
        </Button>
      </Box>

      <ListaProfesores
        profesores={profesores}
        loading={loading}
        error={error}
        onDelete={onDeleteProfesor}
        onEdit={handleOpenEditar} // 🔹 abrir modal de edición
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            {profesorEdit ? 'Editar Profesor' : 'Crear Nuevo Profesor'}
          </Typography>

          <FormularioProfesor
            onProfesorCreado={handleFormSubmit}
            onRequestClose={handleClose}
            profesorToEdit={profesorEdit} // 🔹 si es null, el formulario crea
          />
        </Box>
      </Modal>
    </Box>
  );
};
