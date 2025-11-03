import { useState, useEffect } from 'react';
import { type ICreateProfesorDto, type IProfesor } from '../types/profesor.types.ts';
import apiClient from '../apiService';
import axios from 'axios';
import { Box, TextField, Button, Alert, Paper } from '@mui/material';

const initialState: ICreateProfesorDto = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  fechaNacimiento: '',
  telefono: '',
  especialidades: '',
};

interface FormularioProfesorProps {
  onProfesorCreado: () => void;
  onRequestClose?: () => void;
  profesorToEdit?: IProfesor | null;
}

export function FormularioProfesor({ onProfesorCreado, onRequestClose, profesorToEdit }: FormularioProfesorProps) {
  const [formData, setFormData] = useState<ICreateProfesorDto>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profesorToEdit) {
      setFormData({
        nombre: profesorToEdit.nombre,
        apellido: profesorToEdit.apellido,
        dni: profesorToEdit.dni,
        email: profesorToEdit.email,
        fechaNacimiento: profesorToEdit.fechaNacimiento,
        telefono: profesorToEdit.telefono ?? '',
        especialidades: profesorToEdit.especialidades ?? '',
      });
    } else {
      setFormData(initialState);
    }
  }, [profesorToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (profesorToEdit) {
        // Editar profesor existente
        const response = await apiClient.patch(`/profesores/${profesorToEdit.legajoProfesor}`, formData);
        setSuccess(`Profesor "${response.data.nombre}" actualizado correctamente.`);
      } else {
        // Crear nuevo profesor
        const response = await apiClient.post('/profesores', formData);
        setSuccess(`Profesor "${response.data.nombre}" creado con legajo ${response.data.legajoProfesor}.`);
      }

      onProfesorCreado();
      if (onRequestClose) onRequestClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        setError('Error al procesar el formulario. Revise la consola.');
      }
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required fullWidth />
        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required fullWidth />
        <TextField label="DNI" name="dni" value={formData.dni} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
        <TextField
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField label="Teléfono (Opcional)" name="telefono" value={formData.telefono || ''} onChange={handleChange} fullWidth />
        <TextField
          label="Especialidades (Opcional)"
          name="especialidades"
          value={formData.especialidades || ''}
          onChange={handleChange}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {profesorToEdit ? 'Actualizar Profesor' : 'Guardar Profesor'}
          </Button>
        </Box>

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}

