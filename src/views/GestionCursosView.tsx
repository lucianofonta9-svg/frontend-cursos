import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaCursos } from '../components/ListaCursos';
import { FormularioCurso } from '../components/FormularioCurso';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: 500,
};

// --- VISTA: GESTIÓN DE CURSOS ---
export const GestionCursosView = ({
  cursos,
  loading,
  error,
  onCursoCreado,
  onDeleteCurso,
}: {
  cursos: any[];
  loading: boolean;
  error: any;
  onCursoCreado: () => void;
  onDeleteCurso: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleFormSubmit = () => {
    onCursoCreado();
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Cursos</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Crear Curso
        </Button>
      </Box>
      <ListaCursos cursos={cursos} loading={loading} error={error} onDelete={onDeleteCurso} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Crear Nuevo Curso
          </Typography>
          <FormularioCurso onCursoCreado={handleFormSubmit} onRequestClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};
