import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box } from '@mui/material'; 
// Componentes de Personas
import { ListaProfesores } from './components/ListaProfesores';
import { FormularioProfesor } from './components/FormularioProfesor';
import { ListaAlumnos } from './components/ListaAlumnos';
import { FormularioAlumno } from './components/FormularioAlumno';
// Componentes de Cursos y Tablas
import { FormularioCurso } from './components/FormularioCurso'; 
import { ListaCursos } from './components/ListaCursos';
// Componentes Centrales
import { FormularioInscripcion } from './components/FormularioInscripcion'; 
import { ListaInscripciones } from './components/ListaInscripciones';

import apiClient from './apiService';
// Tipos de datos
import { type IProfesor } from './types/profesor.types.ts';
import { type IAlumno } from './types/alumno.types.ts';
import { type IInscripcion } from './types/inscripcion.types.ts';
import { type ICurso } from './types/curso.types.ts'; 


function App() {
  // --- ESTADOS DE DATOS ---
  // Profesores
  const [profesores, setProfesores] = useState<IProfesor[]>([]);
  const [loadingProfesores, setLoadingProfesores] = useState<boolean>(true);
  const [errorProfesores, setErrorProfesores] = useState<string | null>(null);
  // Alumnos
  const [alumnos, setAlumnos] = useState<IAlumno[]>([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState<boolean>(true);
  const [errorAlumnos, setErrorAlumnos] = useState<string | null>(null);
  // Cursos
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);
  const [errorCursos, setErrorCursos] = useState<string | null>(null);
  // Inscripciones
  const [inscripciones, setInscripciones] = useState<IInscripcion[]>([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState<boolean>(true);
  const [errorInscripciones, setErrorInscripciones] = useState<string | null>(null);
  
  // ESTADO CLAVE: Key para forzar el remontaje del formulario de Inscripción
  const [keyInscripcionForm, setKeyInscripcionForm] = useState(0); 
  
  // --- FUNCIONES DE FETCH (Recarga de datos) ---

  const fetchProfesores = useCallback(async () => {
    try {
      setLoadingProfesores(true);
      const response = await apiClient.get<IProfesor[]>('/profesores');
      setProfesores(response.data);
      setErrorProfesores(null);
    } catch (err) {
      setErrorProfesores('No se pudieron cargar los profesores.');
      console.error('Error fetching profesores:', err);
    } finally {
      setLoadingProfesores(false);
    }
  }, []);

  const fetchAlumnos = useCallback(async () => {
    try {
      setLoadingAlumnos(true);
      const response = await apiClient.get<IAlumno[]>('/alumnos');
      setAlumnos(response.data);
      setErrorAlumnos(null);
    } catch (err) {
      setErrorAlumnos('No se pudieron cargar los alumnos.');
      console.error('Error fetching alumnos:', err);
    } finally {
      setLoadingAlumnos(false);
    }
  }, []);

  const fetchCursos = useCallback(async () => {
    try {
      setLoadingCursos(true);
      const response = await apiClient.get<ICurso[]>('/cursos');
      setCursos(response.data);
      setErrorCursos(null);
    } catch (err) {
      setErrorCursos('No se pudieron cargar los cursos.');
      console.error('Error fetching cursos:', err);
    } finally {
      setLoadingCursos(false);
    }
  }, []);

  const fetchInscripciones = useCallback(async () => {
    try {
      setLoadingInscripciones(true);
      const response = await apiClient.get<IInscripcion[]>('/inscripciones'); 
      setInscripciones(response.data);
      setErrorInscripciones(null);
    } catch (err) {
      setErrorInscripciones('No se pudieron cargar las inscripciones.');
      console.error('Error fetching inscripciones:', err);
    } finally {
      setLoadingInscripciones(false);
    }
  }, []);

  // --- HANDLERS DE EVENTOS Y RECARGA ---

  // Función que recarga listas y fuerza el remontaje del formulario
  const handleRecargarFormInscripcion = () => {
    fetchAlumnos();
    fetchCursos();
    setKeyInscripcionForm(prevKey => prevKey + 1); 
  };
  
  // Handler simple para recarga de lista de profesores
  const handleProfesorCreado = () => { fetchProfesores(); };

  // Handlers que fuerzan la recarga de listas de Inscripción (el select)
  const handleAlumnoCreado = () => { handleRecargarFormInscripcion(); };
  const handleCursoCreado = () => { handleRecargarFormInscripcion(); }; 

  const handleInscripcionCreada = () => {
    fetchInscripciones(); 
    handleRecargarFormInscripcion();
  };
  
  // --- CARGA INICIAL (useEffect) ---
  useEffect(() => {
    fetchProfesores();
    fetchAlumnos();
    fetchCursos(); 
    fetchInscripciones(); 
  }, [fetchProfesores, fetchAlumnos, fetchCursos, fetchInscripciones]); 
  
  // -------------------------------------------------------------
  // LAYOUT
  // -------------------------------------------------------------
  return (
    <Container maxWidth="xl">
      <Typography variant="h3" component="h1" gutterBottom sx={{ marginTop: 2, textAlign: 'center' }}>
        Sistema de Gestión de Cursos
      </Typography>
      <hr />

      {/* SECCIÓN FORMULARIOS (Profesores, Cursos, Alumnos) */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, // 3 columnas en pantallas grandes
        gap: 3, 
        marginTop: 4,
        width: '100%', 
        justifyContent: 'space-between', 
      }}>
        
        {/* Columna 1: Profesores */}
        <Box sx={{ flex: 1, minWidth: { lg: 300 } }}> 
          <Typography variant="h5" component="h2" gutterBottom>Gestión de Profesores</Typography>
          <FormularioProfesor onProfesorCreado={handleProfesorCreado} />
        </Box>

        {/* Columna 2: Cursos */}
        <Box sx={{ flex: 1, minWidth: { lg: 300 } }}>
          <Typography variant="h5" component="h2" gutterBottom>Gestión de Cursos</Typography>
          <FormularioCurso onCursoCreado={handleCursoCreado} />
        </Box>

        {/* Columna 3: Alumnos */}
        <Box sx={{ flex: 1, minWidth: { lg: 300 } }}>
          <Typography variant="h5" component="h2" gutterBottom>Gestión de Alumnos</Typography>
          <FormularioAlumno onAlumnoCreado={handleAlumnoCreado} />
        </Box>
      </Box>
      
      {/* SECCIÓN INSCRIPCIONES Y NOTAS */}
      <Box sx={{ marginTop: 6, padding: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Gestión Central de Inscripciones
        </Typography>
        
        <FormularioInscripcion 
            key={keyInscripcionForm} // <--- CLAVE PARA LA RECARGA
            onInscripcionCreada={handleInscripcionCreada} 
        />
        
        <ListaInscripciones
          inscripciones={inscripciones}
          loading={loadingInscripciones}
          error={errorInscripciones}
          onEstadoCambiado={handleInscripcionCreada} // Usa el handler para recargar todo
        />
      </Box>

      {/* SECCIÓN LISTADOS GENERALES */}
      <Box sx={{ marginTop: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Listados Generales
        </Typography>
        
        <ListaCursos
          cursos={cursos}
          loading={loadingCursos}
          error={errorCursos}
        />
        <ListaProfesores
          profesores={profesores}
          loading={loadingProfesores}
          error={errorProfesores}
        />
        <ListaAlumnos
          alumnos={alumnos}
          loading={loadingAlumnos}
          error={errorAlumnos}
        />
      </Box>

    </Container>
  );
}

export default App;
