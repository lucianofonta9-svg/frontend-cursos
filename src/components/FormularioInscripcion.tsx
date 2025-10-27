import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import axios from 'axios';
// Importa los tipos necesarios
import { type ICreateInscripcionDto } from '../types/inscripcion.types'; 
// CORRECCIÓN: Importa IAlumno desde su archivo base (alumno.types)
import { type IAlumno } from '../types/alumno.types'; 
// CORRECCIÓN: Importa ICurso desde su archivo base (curso.types)
import { type ICurso } from '../types/curso.types'; 

import {
  Box, Button, Typography, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem, 
  // CORRECCIÓN: Importa SelectChangeEvent como 'type'
  type SelectChangeEvent, CircularProgress
} from '@mui/material';

// Estado inicial del DTO (los valores 0 representan "no seleccionado")
const initialState: ICreateInscripcionDto = {
  alumnoLegajo: 0,
  cursoId: 0,
};

interface FormularioInscripcionProps {
  onInscripcionCreada: () => void;
}

export function FormularioInscripcion({ onInscripcionCreada }: FormularioInscripcionProps) {
  const [formData, setFormData] = useState<ICreateInscripcionDto>(initialState);
  const [alumnos, setAlumnos] = useState<IAlumno[]>([]); 
  const [cursos, setCursos] = useState<ICurso[]>([]);     
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carga inicial de ALUMNOS y CURSOS para los select
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        setLoading(true);
        // Llama a las dos APIs simultáneamente
        const [alumnosRes, cursosRes] = await Promise.all([
          apiClient.get<IAlumno[]>('/alumnos'),
          apiClient.get<ICurso[]>('/cursos'),
        ]);
        setAlumnos(alumnosRes.data);
        setCursos(cursosRes.data);
      } catch (err: unknown) {
        setError('Error cargando listas para inscripción. Revise si hay Alumnos o Cursos activos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectData();
  }, []);

  const handleChange = (e: SelectChangeEvent<number>) => {
    // Maneja los cambios de los Selects (alumnoLegajo o cursoId)
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value), // Aseguramos que el valor sea un número
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación básica en el frontend
    if (formData.alumnoLegajo === 0 || formData.cursoId === 0) {
        setError("Debe seleccionar un alumno y un curso.");
        return;
    }

    try {
      // Envía el DTO al backend (ej: { alumnoLegajo: 1, cursoId: 5 })
      await apiClient.post('/inscripciones', formData);
      setSuccess(`Alumno inscrito correctamente.`);
      setFormData(initialState); 
      onInscripcionCreada(); // Avisa a App.tsx para que recargue la lista de inscripciones

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // Maneja errores específicos del backend (validaciones)
        const status = err.response.status;
        if (status === 404) {
          setError('Error: Alumno o Curso no encontrado/inactivo.');
        } else if (status === 409) {
          setError('Conflicto: El alumno ya está inscrito en este curso.');
        } else if (err.response.data.message) {
          // Captura mensajes de class-validator (errores 400)
          const apiErrors = err.response.data.message as string[];
          setError(apiErrors.join(', '));
        } else {
          setError(`Error de servidor al inscribir: ${status}.`);
        }
      } else {
        setError('Error de conexión o de red.');
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
        <Typography variant="h5">Inscribir Alumno a Curso</Typography>
        
        {/* SELECT ALUMNO */}
        <FormControl fullWidth required>
          <InputLabel>Seleccionar Alumno</InputLabel>
          <Select
            label="Seleccionar Alumno"
            name="alumnoLegajo"
            // Maneja el valor 0 (no seleccionado)
            value={formData.alumnoLegajo || ''} 
            onChange={handleChange}
            // Muestra mensaje si no hay datos
            disabled={alumnos.length === 0} 
          >
            {alumnos.map((alu) => (
              <MenuItem key={alu.legajoAlumno} value={alu.legajoAlumno}>
                {alu.legajoAlumno} - {alu.nombre} {alu.apellido} ({alu.dni})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SELECT CURSO */}
        <FormControl fullWidth required>
          <InputLabel>Seleccionar Curso</InputLabel>
          <Select
            label="Seleccionar Curso"
            name="cursoId"
            value={formData.cursoId || ''} 
            onChange={handleChange}
            disabled={cursos.length === 0}
          >
            {cursos.map((cur) => (
              <MenuItem key={cur.id} value={cur.id}>
                ID {cur.id} - {cur.nombre} (Profesor: {cur.profesorLegajo || 'Sin Asignar'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
            type="submit" 
            variant="contained" 
            color="secondary" 
            sx={{ marginTop: 2 }}
            disabled={alumnos.length === 0 || cursos.length === 0} // Deshabilita si no hay opciones
        >
          Inscribir
        </Button>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}