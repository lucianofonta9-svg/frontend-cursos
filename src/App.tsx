import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, BrowserRouter } from 'react-router-dom';
import {
  Container, Typography, Box, Tabs, Tab, AppBar, Toolbar,
  Button, Modal, Paper, IconButton // Asegúrate de tener IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // Asegúrate de tener DeleteIcon
import apiClient from './apiService';

// Componentes y Tipos
import { ListaProfesores } from './components/ListaProfesores';
import { FormularioProfesor } from './components/FormularioProfesor';
import { ListaAlumnos } from './components/ListaAlumnos';
import { FormularioAlumno } from './components/FormularioAlumno';
import { FormularioCurso } from './components/FormularioCurso';
import { ListaCursos } from './components/ListaCursos';
import { FormularioInscripcion } from './components/FormularioInscripcion';
import { ListaInscripciones } from './components/ListaInscripciones';
import { type IProfesor } from './types/profesor.types.ts';
import { type IAlumno } from './types/alumno.types.ts';
import { type IInscripcion } from './types/inscripcion.types.ts';
import { type ICurso } from './types/curso.types.ts';


// Estilo del Modal
const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
};

// -------------------------------------------------------------
// I. COMPONENTES DE VISTAS (Páginas con Modal y Botón Eliminar)
// -------------------------------------------------------------

// --- VISTA: GESTIÓN DE PROFESORES ---
const GestionProfesoresView = ({ profesores, loading, error, onProfesorCreado, onDeleteProfesor }: any) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleFormSubmit = () => { onProfesorCreado(); setOpen(false); };

    return (
        <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Gestión de Profesores</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Crear Profesor
                </Button>
            </Box>
            <ListaProfesores profesores={profesores} loading={loading} error={error} onDelete={onDeleteProfesor} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Crear Nuevo Profesor</Typography>
                    <FormularioProfesor onProfesorCreado={handleFormSubmit} onRequestClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
};

// --- VISTA: GESTIÓN DE ALUMNOS ---
const GestionAlumnosView = ({ alumnos, loading, error, onAlumnoCreado, onDeleteAlumno }: any) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleFormSubmit = () => { onAlumnoCreado(); setOpen(false); };

    return (
        <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Gestión de Alumnos</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Crear Alumno
                </Button>
            </Box>
            <ListaAlumnos alumnos={alumnos} loading={loading} error={error} onDelete={onDeleteAlumno} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Crear Nuevo Alumno</Typography>
                    <FormularioAlumno onAlumnoCreado={handleFormSubmit} onRequestClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
};

// --- VISTA: GESTIÓN DE CURSOS ---
const GestionCursosView = ({ cursos, loading, error, onCursoCreado, onDeleteCurso }: any) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleFormSubmit = () => { onCursoCreado(); setOpen(false); };

    return (
        <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Gestión de Cursos</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Crear Curso
                </Button>
            </Box>
            <ListaCursos cursos={cursos} loading={loading} error={error} onDelete={onDeleteCurso} />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Crear Nuevo Curso</Typography>
                    <FormularioCurso onCursoCreado={handleFormSubmit} onRequestClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
};

// --- VISTA: GESTIÓN DE INSCRIPCIONES ---
const GestionInscripcionesView = ({ inscripciones, loading, error, onInscripcionCreada, onEstadoCambiado, onDeleteInscripcion, keyInscripcionForm }: any) => { // Añadido onDeleteInscripcion
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleFormSubmit = () => { onInscripcionCreada(); setOpen(false); };

    return (
        <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Gestión Central de Inscripciones</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Crear Nueva Inscripción
                </Button>
            </Box>
            <ListaInscripciones
                inscripciones={inscripciones}
                loading={loading}
                error={error}
                onEstadoCambiado={onEstadoCambiado}
                onDelete={onDeleteInscripcion} // Pasa la función de eliminar
            />
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Crear Nueva Inscripción</Typography>
                    <FormularioInscripcion
                        key={keyInscripcionForm}
                        onInscripcionCreada={handleFormSubmit}
                        onRequestClose={handleClose}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

// --- VISTA: DASHBOARD ---
const DashboardView = ({ inscripciones, profesores, alumnos, cursos, loadingInscripciones, errorInscripciones, onEstadoCambiado, onDeleteInscripcion }: any) => ( // Añadido onDeleteInscripcion
    <Box sx={{ mt: 3, mx: 'auto', maxWidth: 1400, width: '100%' }}>
        <Typography variant="h5" component="h2" gutterBottom>Panel de Control</Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 4 }}>
             <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h6">Profesores registrados: {profesores.length}</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h6">Cursos activos: {cursos.length}</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h6">Alumnos registrados: {alumnos.length}</Typography>
            </Paper>
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>Últimas Inscripciones</Typography>
        <ListaInscripciones
            inscripciones={inscripciones}
            loading={loadingInscripciones}
            error={errorInscripciones}
            onEstadoCambiado={onEstadoCambiado}
            onDelete={onDeleteInscripcion} // Pasa la función de eliminar
        />
    </Box>
);


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
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { const paths = ['/', '/inscripciones', '/profesores', '/cursos', '/alumnos']; navigate(paths[newValue]); };


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