import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import axios from 'axios';
import { type ICreateCursoDto } from '../types/curso.types';
import { type IProfesor } from '../types/profesor.types'; // Necesario para el Select

import {
  Box, TextField, Button, Typography, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem, 
  // CORRECCIÓN: Importa SelectChangeEvent como 'type'
  type SelectChangeEvent, 
  CircularProgress
} from '@mui/material';

// Estado inicial del DTO
const initialState: ICreateCursoDto = {
  nombre: '',
  descripcion: '',
  duracion: 0,
  profesorLegajo: 0,
};

interface FormularioCursoProps {
  onCursoCreado: () => void;
}

export function FormularioCurso({ onCursoCreado }: FormularioCursoProps) {
  const [formData, setFormData] = useState<ICreateCursoDto>(initialState);
  const [profesores, setProfesores] = useState<IProfesor[]>([]); // Lista para el select
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carga inicial de PROFESORES para el select
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await apiClient.get<IProfesor[]>('/profesores');
        setProfesores(response.data);
      } catch (err: unknown) {
        setError('Error cargando la lista de profesores. ¿El backend está corriendo?');
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  // --- NUEVAS FUNCIONES DE CAMBIO SEPARADAS ---

  // 1. Manejador para TextField (Input Element)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // El valor para 'duracion' debe ser numérico
    const processedValue = name === 'duracion' ? Number(value) : value;
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  // 2. Manejador para Select (SelectChangeEvent)
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    
    // El valor para 'profesorLegajo' siempre es numérico en el Select de este caso
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  // ------------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación básica en el frontend
    if (formData.profesorLegajo === 0) {
        setError("Debe seleccionar un profesor para el curso.");
        return;
    }

    try {
      const response = await apiClient.post('/cursos', formData);
      setSuccess(`Curso "${response.data.nombre}" (ID: ${response.data.id}) creado y asignado.`);
      setFormData(initialState); 
      onCursoCreado(); // Avisa a App.tsx para que recargue la lista de cursos

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else if (err.response.status === 404) {
          setError('Profesor no encontrado o inactivo.');
        } else {
          setError('Error de servidor al crear el curso.');
        }
      } else {
        setError('Error de conexión.');
      }
      console.error(err);
    }
  };
  
  if (loading) return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h5">Añadir Nuevo Curso</Typography>
        
        <TextField
          label="Nombre del Curso"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange} 
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleInputChange} 
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Duración (Horas)"
          name="duracion"
          type="number"
          value={formData.duracion || ''}
          onChange={handleInputChange}
          required
          fullWidth
        />

        {/* SELECT PROFESOR */}
        <FormControl fullWidth required disabled={profesores.length === 0}>
          <InputLabel>Asignar Profesor</InputLabel>
          <Select
            label="Asignar Profesor"
            name="profesorLegajo"
            value={formData.profesorLegajo || ''} 
            onChange={handleSelectChange} 
          >
            {profesores.map((prof) => (
              <MenuItem key={prof.legajoProfesor} value={prof.legajoProfesor}>
                Legajo {prof.legajoProfesor} - {prof.nombre} {prof.apellido}
              </MenuItem>
            ))}
          </Select>
          {profesores.length === 0 && <Typography color="error" variant="caption">No hay profesores activos.</Typography>}
        </FormControl>

        <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 1 }}
            disabled={profesores.length === 0}
        >
          Guardar Curso
        </Button>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}