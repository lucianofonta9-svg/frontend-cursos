import { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaProfesores } from '../components/ListaProfesores';
import { FormularioProfesor } from '../components/FormularioProfesor';

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

export const GestionProfesoresView = ({ profesores, loading, error, onProfesorCreado, onDeleteProfesor }: any) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleFormSubmit = () => { onProfesorCreado(); setOpen(false); };

    return (
        <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Gestión de Profesores</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Crear Profesor
                </Button>
            </Box>
            <ListaProfesores profesores={profesores} loading={loading} error={error} onDelete={onDeleteProfesor} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Crear Nuevo Profesor</Typography>
                    <FormularioProfesor onProfesorCreado={handleFormSubmit} onRequestClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
};

