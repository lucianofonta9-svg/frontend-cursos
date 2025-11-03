import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import axios from 'axios';
import { type ICreateCursoDto, type ICurso } from '../types/curso.types';
import { type IProfesor } from '../types/profesor.types';
import {
  Box, TextField, Button, Typography, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem,
  type SelectChangeEvent,
  CircularProgress
} from '@mui/material';

const initialState: ICreateCursoDto = {
  nombre: '',
  descripcion: '',
  duracion: 0,
  profesorLegajo: 0,
};

interface FormularioCursoProps {
  onCursoCreado: () => void;
  onRequestClose?: () => void;
  cursoToEdit?: ICurso | null; 
}

export function FormularioCurso({ onCursoCreado, onRequestClose, cursoToEdit }: FormularioCursoProps) {
  const [formData, setFormData] = useState<ICreateCursoDto>(initialState);
  const [profesores, setProfesores] = useState<IProfesor[]>([]); // <-- Guarda TODOS (activos e inactivos)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (cursoToEdit) {
      setFormData({
        nombre: cursoToEdit.nombre,
        descripcion: cursoToEdit.descripcion ?? '',
        duracion: cursoToEdit.duracion,
        profesorLegajo: cursoToEdit?.profesorLegajo ?? 0,
      });
    } else {
      setFormData(initialState);
    }
  }, [cursoToEdit]);

  // Cargar lista de profesores
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        // (El backend ahora devuelve a todos, ordenados)
        const response = await apiClient.get<IProfesor[]>('/profesores');
        setProfesores(response.data);
      } catch (err: unknown) {
        setError('Error cargando la lista de profesores.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  // --- 1. FILTRADO DE LISTA ---
  // Creamos una lista derivada que solo contiene profesores activos.
  const profesoresActivos = profesores.filter(prof => prof.activo);

  // Manejo de inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'duracion' ? Number(value) : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.profesorLegajo === 0) {
      setError('Debe seleccionar un profesor para el curso.');
      return;
    }

    try {
      let response;
      if (cursoToEdit) {
        response = await apiClient.patch(`/cursos/${cursoToEdit.id}`, formData);
        setSuccess(`Curso "${response.data.nombre}" actualizado correctamente.`);
      } else {
        response = await apiClient.post('/cursos', formData);
        setSuccess(`Curso "${response.data.nombre}" creado correctamente.`);
      }

      onCursoCreado();
      if (onRequestClose) onRequestClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // --- 2. MANEJO DE ERROR CORREGIDO ---
        const data = err.response.data;
        if (err.response.status === 404) {
          setError('Profesor o curso no encontrado.');
        } else if (data && data.message) {
          // Maneja tanto strings (nuestro error manual) como arrays (errores de DTO)
          const apiError = data.message;
          if (Array.isArray(apiError)) {
              setError(apiError.join(', '));
          } else {
              setError(apiError); // <-- Asigna el string de error "Profesor inactivo..."
          }
        } else {
          setError('Error al guardar el curso.');
        }
      } else {
        setError('Error de conexión con el servidor.');
      }
      console.error(err);
    }
  };

  if (loading) return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

        {/* --- 3. SELECT PROFESOR ACTUALIZADO --- */}
        <FormControl fullWidth required disabled={profesoresActivos.length === 0}>
          <InputLabel>Asignar Profesor</InputLabel>
          <Select
            label="Asignar Profesor"
            name="profesorLegajo"
            value={formData.profesorLegajo || ''}
            onChange={handleSelectChange}
          >
            {/* Mapea solo los profesores activos */}
            {profesoresActivos.map((prof) => (
              <MenuItem key={prof.legajoProfesor} value={prof.legajoProfesor}>
                Legajo {prof.legajoProfesor} - {prof.nombre} {prof.apellido}
              </MenuItem>
            ))}
          </Select>
        {/* Alerta de advertencia actualizada */}
          {profesoresActivos.length === 0 && !loading && (
            <Alert severity="warning" sx={{mt: 1}}>
              No hay profesores activos para asignar.
            </Alert>
          )}
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={profesoresActivos.length === 0} // <-- Se deshabilita si no hay prof. activos
          >
            {cursoToEdit ? 'Actualizar' : 'Guardar'}
          </Button>
       </Box>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}