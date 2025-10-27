import { useState } from 'react';
import { type ICreateNotaDto } from '../types/nota.types';
import { type IInscripcion } from '../types/inscripcion.types';
import apiClient from '../apiService';
import axios from 'axios';

import {
  Box, Button, TextField, Typography, Alert, Modal,
} from '@mui/material';

// Estilo simple para centrar el modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface FormularioNotaModalProps {
  inscripcion: IInscripcion | null; // La inscripción a la que se asignará la nota
  open: boolean;
  onClose: () => void; // Función para cerrar el modal
  onNotaRegistrada: () => void; // Función para avisar al padre que recargue
}

// Definimos el estado inicial del formulario
const initialState: Omit<ICreateNotaDto, 'inscripcionId'> = {
  nombreEvaluacion: '',
  calificacion: 0,
};

export function FormularioNotaModal({ inscripcion, open, onClose, onNotaRegistrada }: FormularioNotaModalProps) {
  const [formData, setFormData] = useState<Omit<ICreateNotaDto, 'inscripcionId'>>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Resetea el estado cuando se abre o cierra
  const handleModalClose = () => {
    setFormData(initialState);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aseguramos que la calificación se guarde como número
    let processedValue: string | number = value;
    if (name === 'calificacion') {
        // Usamos parseFloat para manejar el valor del input number con decimales
        processedValue = parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!inscripcion) {
        setError("Error interno: Inscripción no seleccionada.");
        return;
    }
    
    // Validamos que la calificación sea un número válido y no vacío
    if (isNaN(formData.calificacion) || formData.calificacion < 0 || formData.calificacion > 10) {
        setError("La calificación debe ser un número válido entre 0.00 y 10.00.");
        return;
    }
    
    // El DTO completo que se envía
    const dtoCompleto: ICreateNotaDto = {
        ...formData,
        inscripcionId: inscripcion.id, // Añadimos la clave foránea aquí
    };
    
    try {
      await apiClient.post('/notas', dtoCompleto);
      setSuccess(`Nota ${formData.calificacion.toFixed(2)} registrada con éxito.`);
      
      // Tras un breve tiempo, cerramos y recargamos
      setTimeout(() => {
        handleModalClose();
        onNotaRegistrada(); 
      }, 1500);

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // Captura y muestra los errores de validación del backend
        const apiErrors = err.response.data.message as string[] | string;
        setError(Array.isArray(apiErrors) ? apiErrors.join(', ') : apiErrors || 'Error al registrar la nota.');
      } else {
        setError('Error de conexión o datos inválidos.');
      }
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          Registrar Nota
        </Typography>
        
        {/* Información del Contexto */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Alumno: {inscripcion?.alumno.nombre} {inscripcion?.alumno.apellido}
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Curso: {inscripcion?.curso.nombre}
        </Typography>

        {/* Inputs */}
        <TextField
          label="Nombre de la Evaluación"
          name="nombreEvaluacion"
          value={formData.nombreEvaluacion}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Calificación (0.00 a 10.00)"
          name="calificacion"
          type="number"
          // CORRECCIÓN CLAVE: Pasamos step al objeto inputProps
          inputProps={{ 
              min: 0, 
              max: 10, 
              step: "0.01" // AHORA ESTÁ ANIDADO
          }}
          value={formData.calificacion === 0 ? '' : formData.calificacion} // Usamos '' para que el 0 inicial no se muestre
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 3 }}
        />

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Botones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar Nota
            </Button>
        </Box>
      </Box>
    </Modal>
  );
}
