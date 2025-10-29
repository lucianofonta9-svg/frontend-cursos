import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import axios from 'axios';
import { type ICreateInscripcionDto } from '../types/inscripcion.types';
import { type IAlumno } from '../types/alumno.types';
import { type ICurso } from '../types/curso.types';
import {
  Box, Button, Typography, Alert, Paper,
  FormControl, InputLabel, Select, MenuItem,
  type SelectChangeEvent, CircularProgress
} from '@mui/material';

const initialState: ICreateInscripcionDto = {
  alumnoLegajo: 0,
  cursoId: 0,
};

interface FormularioInscripcionProps {
  onInscripcionCreada: () => void;
  onRequestClose?: () => void;
  key?: number;
}

export function FormularioInscripcion({ onInscripcionCreada, onRequestClose }: FormularioInscripcionProps) {
  const [formData, setFormData] = useState<ICreateInscripcionDto>(initialState);
  const [alumnos, setAlumnos] = useState<IAlumno[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        setLoading(true);
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
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.alumnoLegajo === 0 || formData.cursoId === 0) {
        setError("Debe seleccionar un alumno y un curso.");
        return;
    }

    try {
      await apiClient.post('/inscripciones', formData);
      setSuccess(`Alumno inscrito correctamente.`);
      setFormData(initialState);
      
      // --- CORRECCIÓN DE ORDEN ---
      // 1. PRIMERO cerramos el modal (si la función existe)
      if (onRequestClose) {
        onRequestClose();
      }
      // 2. SEGUNDO avisamos a App.tsx que recargue (esto destruye el componente)
      onInscripcionCreada();

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 404) {
          setError('Error: Alumno o Curso no encontrado/inactivo.');
        } else if (status === 409) {
          setError('Conflicto: El alumno ya está inscrito en este curso.');
        } else if (err.response.data.message) {
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
    <Paper elevation={3} sx={{ padding: 3 }}>
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
            value={formData.alumnoLegajo || ''}
            onChange={handleChange}
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

        {/* Contenedor de Botones (Corregido - Eliminado el botón duplicado) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>Cancelar</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={alumnos.length === 0 || cursos.length === 0}>
              Inscribir
          </Button>
        </Box>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}