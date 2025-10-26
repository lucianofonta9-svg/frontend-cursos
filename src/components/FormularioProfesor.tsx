import { useState } from 'react';
import { type ICreateProfesorDto } from '../types/profesor.types.ts';
import apiClient from '../apiService';
import axios from 'axios'; // 1. IMPORTANTE: Importa axios para verificar el error

// Componentes de MUI para el formulario
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

// Definimos el estado inicial (vacío)
const initialState: ICreateProfesorDto = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  fechaNacimiento: '', // Usamos string para el input tipo 'date'
  telefono: '',
  especialidades: '',
};

export function FormularioProfesor() {
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

    // --- 2. CORRECCIÓN DE SINTAXIS AQUÍ ---
    } catch (err: unknown) { // Cambiamos de 'any' a 'unknown'
      
      // 3. Verificamos el tipo de error
      if (axios.isAxiosError(err) && err.response) {
        
        // Si es un error 400 (Bad Request) de class-validator
        if (err.response.status === 400) {
          // 'message' es el array de errores de NestJS
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else {
          // Otro error de servidor (ej: 500)
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        // Error genérico (ej: de red)
        setError('Error al crear el profesor. Revise la consola.');
      }
      console.error(err);
    }
    // ------------------------------------
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        padding: 3, 
        border: '1px solid #ccc', 
        borderRadius: 2,
        marginTop: 4,
      }}
    >
      <Typography variant="h5">Añadir Nuevo Profesor</Typography>
      
      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
      />
      <TextField
        label="DNI"
        name="dni"
        value={formData.dni}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Fecha de Nacimiento"
        name="fechaNacimiento"
        type="date" 
        value={formData.fechaNacimiento}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }} 
        required
      />
      <TextField
        label="Teléfono (Opcional)"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
      />
      <TextField
        label="Especialidades (Opcional)"
        name="especialidades"
        value={formData.especialidades}
        onChange={handleChange}
      />

      <Button type="submit" variant="contained" color="primary">
        Guardar Profesor
      </Button>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}