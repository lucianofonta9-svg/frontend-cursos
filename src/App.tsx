import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, BrowserRouter } from 'react-router-dom';
import { Container, Typography, Box, Tabs, Tab, AppBar, Toolbar } from '@mui/material';
import apiClient from './apiService';

// Componentes y Tipos
import { type IProfesor } from './types/profesor.types.ts';
import { type IAlumno } from './types/alumno.types.ts';
import { type IInscripcion } from './types/inscripcion.types.ts';
import { type ICurso } from './types/curso.types.ts';

// Import   Views 
import { GestionProfesoresView } from './views/GestionProfesoresView';
import { GestionAlumnosView } from './views/GestionAlumnosView';
import { GestionCursosView } from './views/GestionCursosView';
import { GestionInscripcionesView } from './views/GestionInscripcionesView';
import { DashboardView } from './views/DashboardView';




// -------------------------------------------------------------
// II. APP LOGIC WRAPPER (Lógica y Router)
// -------------------------------------------------------------

function AppLogicWrapper() {
    // --- ESTADOS DE DATOS ---
    const [profesores, setProfesores] = useState<IProfesor[]>([]);
    const [loadingProfesores, setLoadingProfesores] = useState<boolean>(true);
    const [errorProfesores, setErrorProfesores] = useState<string | null>(null);
    const [alumnos, setAlumnos] = useState<IAlumno[]>([]);
    const [loadingAlumnos, setLoadingAlumnos] = useState<boolean>(true);
    const [errorAlumnos, setErrorAlumnos] = useState<string | null>(null);
    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [loadingCursos, setLoadingCursos] = useState<boolean>(true);
    const [errorCursos, setErrorCursos] = useState<string | null>(null);
    const [inscripciones, setInscripciones] = useState<IInscripcion[]>([]);
    const [loadingInscripciones, setLoadingInscripciones] = useState<boolean>(true);
    const [errorInscripciones, setErrorInscripciones] = useState<string | null>(null);
    const [keyInscripcionForm, setKeyInscripcionForm] = useState(0);

    // --- HOOKS DEL ROUTER ---
    const navigate = useNavigate();
    const location = useLocation();

    // --- FUNCIONES DE FETCH (CON LÓGICA COMPLETA) ---
    const fetchProfesores = useCallback(async () => { try { setLoadingProfesores(true); const r = await apiClient.get<IProfesor[]>('/profesores'); setProfesores(r.data); setErrorProfesores(null); } catch (err) { setErrorProfesores('Error cargando profesores.'); console.error(err); } finally { setLoadingProfesores(false); } }, []);
    const fetchAlumnos = useCallback(async () => { try { setLoadingAlumnos(true); const r = await apiClient.get<IAlumno[]>('/alumnos'); setAlumnos(r.data); setErrorAlumnos(null); } catch (err) { setErrorAlumnos('Error cargando alumnos.'); console.error(err); } finally { setLoadingAlumnos(false); } }, []);
    const fetchCursos = useCallback(async () => { try { setLoadingCursos(true); const r = await apiClient.get<ICurso[]>('/cursos'); setCursos(r.data); setErrorCursos(null); } catch (err) { setErrorCursos('Error cargando cursos.'); console.error(err); } finally { setLoadingCursos(false); } }, []);
    const fetchInscripciones = useCallback(async () => { try { setLoadingInscripciones(true); const r = await apiClient.get<IInscripcion[]>('/inscripciones'); setInscripciones([...r.data]); setErrorInscripciones(null); } catch (err) { setErrorInscripciones('Error cargando inscripciones.'); console.error(err); } finally { setLoadingInscripciones(false); } }, []);


    // --- HANDLERS DE RECARGA ---
    const handleRecargarFormInscripcion = useCallback(() => { fetchAlumnos(); fetchCursos(); setKeyInscripcionForm(prev => prev + 1); }, [fetchAlumnos, fetchCursos]);
    const handleProfesorCreado = () => { fetchProfesores(); };
    const handleAlumnoCreado = () => { fetchAlumnos(); handleRecargarFormInscripcion(); };
    const handleCursoCreado = () => { fetchCursos(); handleRecargarFormInscripcion(); };
    const handleInscripcionCreada = () => { fetchInscripciones(); handleRecargarFormInscripcion(); };

    // --- HANDLERS DE EDICION ---

    const handleEditProfesor = useCallback(async (profesor: IProfesor) => {
        // Aquí iría la lógica para editar, por ejemplo:
        // 1. Abrir un modal (requiere estado global o mover estado del modal aquí)
        // 2. O navegar a una ruta de edición (ej: navigate(`/profesores/editar/${profesor.legajo}`))
        // Por ahora, solo mostramos una alerta:
        console.log("Editando profesor:", profesor);
        alert(`Implementar lógica de edición para ${profesor.nombre} ${profesor.apellido}`);
        
        // Si la edición se hiciera en un modal y se guardara:
        // try {
        //     await apiClient.patch(`/profesores/${profesor.legajo}`, profesor);
        //     fetchProfesores(); // Recargar la lista
        // } catch (err) {
        //     console.error('Error al editar profesor:', err);
        // }
    }, []);

    // --- HANDLERS DE ELIMINACIÓN ---
    const handleDeleteProfesor = useCallback(async (legajo: number) => { if (!window.confirm(`¿Dar de baja al profesor ${legajo}?`)) return; try { await apiClient.delete(`/profesores/${legajo}`); fetchProfesores(); } catch (err) { console.error('Error al eliminar profesor:', err); /* Añadir alerta de error */ } }, [fetchProfesores]);
    const handleDeleteAlumno = useCallback(async (legajo: number) => { if (!window.confirm(`¿Dar de baja al alumno ${legajo}?`)) return; try { await apiClient.delete(`/alumnos/${legajo}`); fetchAlumnos(); } catch (err) { console.error('Error al eliminar alumno:', err); /* Añadir alerta de error */ } }, [fetchAlumnos]);
    const handleDeleteCurso = useCallback(async (id: number) => { if (!window.confirm(`¿Dar de baja al curso ${id}?`)) return; try { await apiClient.delete(`/cursos/${id}`); fetchCursos(); } catch (err) { console.error('Error al eliminar curso:', err); /* Añadir alerta de error */ } }, [fetchCursos]);
    // --- NUEVO HANDLER PARA ELIMINAR INSCRIPCIÓN ---
    const handleDeleteInscripcion = useCallback(async (id: number) => {
        if (!window.confirm(`¿Eliminar la inscripción ${id}? Esta acción es permanente y borrará las notas asociadas.`)) return;
        try {
            await apiClient.delete(`/inscripciones/${id}`); // Llama al DELETE
            fetchInscripciones(); // Recarga la lista
        } catch (err) {
            console.error('Error al eliminar inscripción:', err);
            // Considera añadir una alerta de error aquí
        }
    }, [fetchInscripciones]);

    // --- CARGA INICIAL ---
    useEffect(() => { fetchProfesores(); fetchAlumnos(); fetchCursos(); fetchInscripciones(); }, [fetchProfesores, fetchAlumnos, fetchCursos, fetchInscripciones]);

    // --- LÓGICA DE TABS ---
    const getActiveTabIndex = (pathname: string) => { const paths = ['/', '/inscripciones', '/profesores', '/cursos', '/alumnos']; const index = paths.findIndex(p => pathname === p || pathname.startsWith(p + '/')); return index !== -1 ? index : 0;};
    const activeTabValue = getActiveTabIndex(location.pathname);
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => { const paths = ['/', '/inscripciones', '/profesores', '/cursos', '/alumnos']; navigate(paths[newValue]); };


    // -------------------------------------------------------------
    // LAYOUT Y ROUTER FINAL
    // -------------------------------------------------------------
    return (
        <Box>
            {/* Header */}
            <AppBar position="fixed" color="secondary" sx={{ top: 0, zIndex: 1100, width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Gestor De Cursos</Typography>
                    <Tabs value={activeTabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary" sx={{ marginLeft: 'auto' }}>
                        <Tab label="Inicio" value={0} component={Link} to="/" />
                        <Tab label="Inscripciones" value={1} component={Link} to="/inscripciones" />
                        <Tab label="Profesores" value={2} component={Link} to="/profesores" />
                        <Tab label="Cursos" value={3} component={Link} to="/cursos" />
                        <Tab label="Alumnos" value={4} component={Link} to="/alumnos" />
                    </Tabs>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/* Espaciador */}

            {/* Contenido Principal */}
            <Container maxWidth={false} disableGutters sx={{ p: 3 }}>
                <Routes>
                    <Route path="/" element={<DashboardView
                        inscripciones={inscripciones} loadingInscripciones={loadingInscripciones} errorInscripciones={errorInscripciones}
                        profesores={profesores} alumnos={alumnos} cursos={cursos} onEstadoCambiado={handleInscripcionCreada}
                        onDeleteInscripcion={handleDeleteInscripcion} // Pasa onDelete
                    />} />
                    <Route path="/inscripciones" element={<GestionInscripcionesView
                        inscripciones={inscripciones} loading={loadingInscripciones} error={errorInscripciones}
                        onInscripcionCreada={handleInscripcionCreada} onEstadoCambiado={handleInscripcionCreada}
                        onDeleteInscripcion={handleDeleteInscripcion} // Pasa onDelete
                        keyInscripcionForm={keyInscripcionForm}
                    />} />
                    <Route path="/profesores" element={<GestionProfesoresView
                        profesores={profesores} loading={loadingProfesores} error={errorProfesores}
                        onProfesorCreado={handleProfesorCreado} onDeleteProfesor={handleDeleteProfesor}
                        onEditProfesor={handleEditProfesor} 
                    />} />
                    <Route path="/cursos" element={<GestionCursosView
                        cursos={cursos} loading={loadingCursos} error={errorCursos}
                        onCursoCreado={handleCursoCreado} onDeleteCurso={handleDeleteCurso}
                    />} />
                    <Route path="/alumnos" element={<GestionAlumnosView
                        alumnos={alumnos} loading={loadingAlumnos} error={errorAlumnos}
                        onAlumnoCreado={handleAlumnoCreado} onDeleteAlumno={handleDeleteAlumno}
                    />} />
                    <Route path="*" element={<Typography variant="h5" sx={{ mt: 5 }}>404 | Página no encontrada</Typography>} />
                </Routes>
            </Container>
        </Box>
    );
}

// -------------------------------------------------------------
// III. WRAPPER PRINCIPAL Y EXPORTACIÓN
// -------------------------------------------------------------
export default function App() {
    return (
        <BrowserRouter>
            <AppLogicWrapper />
        </BrowserRouter>
    );
}