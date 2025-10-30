import { useState } from 'react';
import { type ICreateProfesorDto } from '../types/profesor.types.ts';
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

// 1. Añadida la prop onRequestClose
interface FormularioProfesorProps {
  onProfesorCreado: () => void;
  onRequestClose?: () => void; // Prop para cerrar el modal
}

// 2. Recibe la prop onRequestClose
export function FormularioProfesor({ onProfesorCreado, onRequestClose }: FormularioProfesorProps) {
  const [formData, setFormData] = useState<ICreateProfesorDto>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post('/profesores', formData);
      setSuccess(`Profesor "${response.data.nombre}" creado con legajo ${response.data.legajoProfesor}.`);
      setFormData(initialState);
      onProfesorCreado();

      // 3. Llama a onRequestClose si existe (después de éxito)
      if (onRequestClose) {
        onRequestClose();
      }

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        setError('Error al crear el profesor. Revise la consola.');
      }
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {/* Los TextFields se mantienen igual */}
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required fullWidth />
        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required fullWidth />
        <TextField label="DNI" name="dni" value={formData.dni} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
        <TextField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} required fullWidth />
        <TextField label="Teléfono (Opcional)" name="telefono" value={formData.telefono || ''} onChange={handleChange} fullWidth />
        <TextField label="Especialidades (Opcional)" name="especialidades" value={formData.especialidades || ''} onChange={handleChange} fullWidth />

        {/* 4. Añadido el Box para los botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
            <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar Profesor
            </Button>
        </Box>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}