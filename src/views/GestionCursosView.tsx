import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ListaCursos } from '../components/ListaCursos';
import { FormularioCurso } from '../components/FormularioCurso';
import { type ICurso } from '../types/curso.types';
import { GenericSearchFilter } from '../components/FiltradoGenerico';

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


export const GestionCursosView = ({
  cursos,
  loading,
  error,
  onCursoCreado,
  onDeactivateCurso,
  onReactivateCurso,
}: {
  cursos: ICurso[];
  loading: boolean;
  error: string | null;
  onCursoCreado: () => void;
  onDeactivateCurso: (id: number) => void;
  onReactivateCurso: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [cursoEdit, setCursoEdit] = useState<ICurso | null>(null);

  // Estado para cursos filtrados
  const [cursosFiltrados, setCursosFiltrados] = useState<ICurso[]>(cursos);

  useEffect(() => {
    setCursosFiltrados(cursos);
  }, [cursos]);

  const handleClose = () => {
    setOpen(false);
    setCursoEdit(null);
  };

  const handleOpenNuevo = () => {
    setCursoEdit(null);
    setOpen(true);
  };


  const handleOpenEditar = (curso: ICurso) => {
    setCursoEdit(curso);
    setOpen(true);
  };

  const handleFormSubmit = () => {
    onCursoCreado();
    handleClose();
  };

  return (
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Cursos</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleOpenNuevo}
        >
          Crear Curso
        </Button>
      </Box>

      {/* Filtro de búsqueda */}
      <GenericSearchFilter
        data={cursos}
        keys={['nombre', 'descripcion']}
        onFiltered={setCursosFiltrados}
        placeholder="Buscar cursos..."
      />


      <ListaCursos
        cursos={cursosFiltrados}
        loading={loading}
        error={error}
        onDeactivate={onDeactivateCurso} 
        onEdit={handleOpenEditar}       
        onReactivate={onReactivateCurso} 
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            {cursoEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </Typography>

          <FormularioCurso
            key={cursoEdit ? cursoEdit.id : 'nuevo'}
            onCursoCreado={handleFormSubmit}
            onRequestClose={handleClose}
            cursoToEdit={cursoEdit}
          />
        </Box>
      </Modal>
    </Box>
  );
};