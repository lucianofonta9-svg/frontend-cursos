import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaInscripciones } from '../components/ListaInscripciones';
import { FormularioInscripcion } from '../components/FormularioInscripcion';

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

// --- VISTA: GESTIÓN DE INSCRIPCIONES ---
export const GestionInscripcionesView = ({
  inscripciones,
  loading,
  error,
  onInscripcionCreada,
  onEstadoCambiado,
  onDeleteInscripcion,
  keyInscripcionForm,
}: {
  inscripciones: any[];
  loading: boolean;
  error: any;
  onInscripcionCreada: () => void;
  onEstadoCambiado: (id: number, nuevoEstado: string) => void;
  onDeleteInscripcion: (id: number) => void;
  keyInscripcionForm: string | number;
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = () => {
    onInscripcionCreada();
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión Central de Inscripciones</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Nueva Inscripción
        </Button>
      </Box>

      <ListaInscripciones
        inscripciones={inscripciones}
        loading={loading}
        error={error}
        onEstadoCambiado={onEstadoCambiado as any}
        onDelete={onDeleteInscripcion}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Crear Nueva Inscripción
          </Typography>
          <FormularioInscripcion
            key={
              typeof keyInscripcionForm === 'string'
                ? parseInt(keyInscripcionForm) || 0
                : keyInscripcionForm
            } 
            onInscripcionCreada={handleFormSubmit}
            onRequestClose={handleClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};

