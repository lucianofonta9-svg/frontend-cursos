import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaAlumnos } from '../components/ListaAlumnos';
import { FormularioAlumno } from '../components/FormularioAlumno';

// --- Estilo del Modal ---
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

// --- VISTA: GESTIÓN DE ALUMNOS ---
export const GestionAlumnosView = ({
  alumnos,
  loading,
  error,
  onAlumnoCreado,
  onDeleteAlumno,
}: any) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleFormSubmit = () => {
    onAlumnoCreado();
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Gestión de Alumnos</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Crear Alumno
        </Button>
      </Box>

      <ListaAlumnos
        alumnos={alumnos}
        loading={loading}
        error={error}
        onDelete={onDeleteAlumno}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Crear Nuevo Alumno
          </Typography>
          <FormularioAlumno
            onAlumnoCreado={handleFormSubmit}
            onRequestClose={handleClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};
