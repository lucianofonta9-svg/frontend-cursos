import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import axios from 'axios';
import { type ICreateCursoDto } from '../types/curso.types';
import { type IProfesor } from '../types/profesor.types'; 
import {
  Box, TextField, Button, Typography, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem, 
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

// 1. Añadida la prop onRequestClose
interface FormularioCursoProps {
  onCursoCreado: () => void;
  onRequestClose?: () => void; // Prop para cerrar el modal
}

// 2. Recibe la prop onRequestClose
export function FormularioCurso({ onCursoCreado, onRequestClose }: FormularioCursoProps) {
  const [formData, setFormData] = useState<ICreateCursoDto>(initialState);
  const [profesores, setProfesores] = useState<IProfesor[]>([]); 
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

  // Manejador para TextField
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'duracion' ? Number(value) : value;
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  // Manejador para Select
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.profesorLegajo === 0) {
        setError("Debe seleccionar un profesor para el curso.");
        return;
    }

    try {
      const response = await apiClient.post('/cursos', formData);
      setSuccess(`Curso "${response.data.nombre}" (ID: ${response.data.id}) creado y asignado.`);
      setFormData(initialState); 
      onCursoCreado(); 

      // 3. Llama a onRequestClose si existe (después de éxito)
      if (onRequestClose) {
        onRequestClose();
      }

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
    // Quitado el margen superior (marginTop) para que el Modal lo controle
    <Paper elevation={3} sx={{ padding: 3 }}> 
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {/* El título se puede quitar si ya está en el Modal */}
        {/* <Typography variant="h5">Añadir Nuevo Curso</Typography> */}
        
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

        {/* 4. Añadido el Box para los botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
            <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>
              Cancelar
            </Button>
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={profesores.length === 0}
            >
              Guardar Curso
            </Button>
        </Box>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}

