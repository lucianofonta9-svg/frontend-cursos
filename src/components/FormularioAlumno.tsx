import { useState } from 'react';
// 1. Cambiado a tipo Alumno DTO
import { type ICreateAlumnoDto } from '../types/alumno.types.ts'; 
import apiClient from '../apiService';
import axios from 'axios'; 
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper 
} from '@mui/material';

// 2. Estado inicial ajustado para Alumno
const initialState: ICreateAlumnoDto = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  fechaNacimiento: '', 
  telefono: '',
  // Nota: 'especialidades' no está en Alumno
};

// 3. Renombrada la interface de props
interface FormularioAlumnoProps {
  onAlumnoCreado: () => void; // 4. Cambiado el nombre de la prop
}

// 5. Renombrado el componente y la prop recibida
export function FormularioAlumno({ onAlumnoCreado }: FormularioAlumnoProps) {
  // 6. Cambiado el tipo del estado
  const [formData, setFormData] = useState<ICreateAlumnoDto>(initialState); 
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
      // 7. Cambiado el endpoint a '/alumnos'
      const response = await apiClient.post('/alumnos', formData); 
      // 8. Mensaje de éxito ajustado
      setSuccess(`Alumno "${response.data.nombre}" creado con legajo ${response.data.legajoAlumno}.`); 
      setFormData(initialState); 
      // 9. Llama a la prop correcta
      onAlumnoCreado(); 

    } catch (err: unknown) { 
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else {
           // 10. Mensaje de error ajustado
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        // 11. Mensaje de error ajustado
        setError('Error al crear el alumno. Revise la consola.'); 
      }
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ marginTop: 4, padding: 3 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
        }}
      >
        {/* 12. Título ajustado */}
        <Typography variant="h5">Añadir Nuevo Alumno</Typography> 
        
        {/* Campos del formulario (sin especialidades) */}
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required fullWidth />
        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required fullWidth />
        <TextField label="DNI" name="dni" value={formData.dni} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
        <TextField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} required fullWidth />
        <TextField label="Teléfono (Opcional)" name="telefono" value={formData.telefono || ''} onChange={handleChange} fullWidth />
        
        {/* 13. Texto del botón ajustado */}
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
          Guardar Alumno 
        </Button>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}