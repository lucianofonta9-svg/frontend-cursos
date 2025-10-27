import { useState } from 'react';
import { type ICreateProfesorDto } from '../types/profesor.types.ts';
import apiClient from '../apiService';
import axios from 'axios'; 

// Componentes de MUI para el formulario
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper // 1. Usaremos Paper para un mejor contenedor
} from '@mui/material';

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

interface FormularioProfesorProps {
  onProfesorCreado: () => void; // Función para recargar la lista
}

export function FormularioProfesor({ onProfesorCreado }: FormularioProfesorProps) {
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
      onProfesorCreado(); // Llama a la función para recargar la lista

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

  // 2. El layout de MUI depende de este Box y sus props 'sx'
  return (
    <Paper elevation={3} sx={{ marginTop: 4, padding: 3 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', // Clave: un input debajo del otro
          gap: 2, // Clave: espacio entre cada input
        }}
      >
        <Typography variant="h5">Añadir Nuevo Profesor</Typography>
        
        {/* Usamos Grid para organizar los campos en dos columnas */}
        {/* (Si prefieres todos en una sola columna, puedes quitar el Grid) */}
        
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          fullWidth // Ocupa todo el ancho
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
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
        <TextField
          label="Teléfono (Opcional)"
          name="telefono"
          value={formData.telefono || ''} // Asegura que sea un string
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Especialidades (Opcional)"
          name="especialidades"
          value={formData.especialidades || ''} // Asegura que sea un string
          onChange={handleChange}
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
          Guardar Profesor
        </Button>

        {/* Alertas de éxito o error */}
        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}