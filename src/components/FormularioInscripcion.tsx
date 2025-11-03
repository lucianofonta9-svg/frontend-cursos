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
        setError('Error cargando listas para inscripción.'); 
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectData();
  }, []);


  // Creamos listas derivadas que solo contienen entidades activas.
  // Estas se usarán para poblar los menús <Select>.
  const alumnosActivos = alumnos.filter(alu => alu.activo);
  const cursosActivos = cursos.filter(cur => cur.activo);

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
      
      if (onRequestClose) {
        onRequestClose();
      }
      onInscripcionCreada();

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 404) {
          setError('Error: Alumno o Curso no encontrado.');
        } else if (status === 409) {
          setError('Conflicto: El alumno ya está inscrito en este curso.');
        
 
        } else if (data && data.message) {

          const apiError = data.message;
          if (Array.isArray(apiError)) {
              setError(apiError.join(', '));
          } else {
              setError(apiError); 
          }
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

        {/* 3. SELECT ALUMNO  */}
        <FormControl fullWidth required>
          <InputLabel>Seleccionar Alumno</InputLabel>
          <Select
            label="Seleccionar Alumno"
            name="alumnoLegajo"
            value={formData.alumnoLegajo || ''}
            onChange={handleChange}
            disabled={alumnosActivos.length === 0} 
          >
          {/* Mapea solo los alumnos activos */}
            {alumnosActivos.map((alu) => (
              <MenuItem key={alu.legajoAlumno} value={alu.legajoAlumno}>
                {alu.legajoAlumno} - {alu.nombre} {alu.apellido} ({alu.dni})
              </MenuItem>
            ))}
          </Select>
        {alumnosActivos.length === 0 && !loading && (
            <Alert severity="warning" sx={{mt: 1}}>No hay alumnos activos para inscribir.</Alert>
        )}
        </FormControl>

        {/* --- 4. SELECT CURSO --- */}
        <FormControl fullWidth required>
          <InputLabel>Seleccionar Curso</InputLabel>
          <Select
            label="Seleccionar Curso"
            name="cursoId"
            value={formData.cursoId || ''}
            onChange={handleChange}
            disabled={cursosActivos.length === 0}
          >
          {/* Mapea solo los cursos activos */}
            {cursosActivos.map((cur) => (
              <MenuItem key={cur.id} value={cur.id}>
                ID {cur.id} - {cur.nombre} (Profesor: {cur.profesorLegajo || 'Sin Asignar'})
              </MenuItem>
            ))}
          </Select>
        {cursosActivos.length === 0 && !loading && (
            <Alert severity="warning" sx={{mt: 1}}>No hay cursos activos para inscribir.</Alert>
        )}
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
          <Button variant="outlined" onClick={onRequestClose ?? (() => {})}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary" 
            disabled={alumnosActivos.length === 0 || cursosActivos.length === 0} 
          >
              Inscribir
          </Button>
        </Box>

        {success && <Alert severity="success" sx={{ marginTop: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
}