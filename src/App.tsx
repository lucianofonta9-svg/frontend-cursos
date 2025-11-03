import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, BrowserRouter } from 'react-router-dom';
import { 
    Container, Typography, Box, Tabs, Tab, AppBar, Toolbar,
    IconButton, Menu, MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import apiClient from './apiService';

// Componentes y Tipos
import { type IProfesor } from './types/profesor.types.ts';
import { type IAlumno } from './types/alumno.types.ts';
import { type IInscripcion } from './types/inscripcion.types.ts';
import { type ICurso } from './types/curso.types.ts';

// Import Views 
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
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    // --- HOOKS DEL ROUTER ---
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleMenuClickAndNavigate = (path: string) => {
        navigate(path);
        handleCloseNavMenu();
    };

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
        console.log("Editando profesor:", profesor);
        alert(`Implementar lógica de edición para ${profesor.nombre} ${profesor.apellido}`);
    }, []);

    // --- HANDLERS DE ELIMINACIÓN / BAJA LÓGICA ---

    // --- Lógica de Profesores ---
    const handleDeactivateProfesor = useCallback(async (legajo: number) => { 
        if (!window.confirm(`¿Dar de baja al profesor ${legajo}?`)) return; 
        try { 
            await apiClient.delete(`/profesores/${legajo}`); 
            fetchProfesores(); 
            fetchCursos();
        } catch (err) { 
            console.error('Error al dar de baja al profesor:', err); 
        } 
    }, [fetchProfesores, fetchCursos]); 

    const handleReactivateProfesor = useCallback(async (legajo: number) => {
        if (!window.confirm(`¿Reactivar al profesor ${legajo}?`)) return;
        try {
            await apiClient.patch(`/profesores/${legajo}/reactivate`);
            fetchProfesores(); 
        } catch (err) {
            console.error('Error al reactivar profesor:', err);
        }
    }, [fetchProfesores]);
    
    // --- Lógica de Alumnos ---
    const handleDeactivateAlumno = useCallback(async (legajo: number) => { 
        if (!window.confirm(`¿Dar de baja al alumno ${legajo}?`)) return; 
        try { 
            await apiClient.delete(`/alumnos/${legajo}`); 
            fetchAlumnos(); 
            fetchInscripciones();
        } catch (err) { 
            console.error('Error al dar de baja al alumno:', err); 
        } 
    }, [fetchAlumnos, fetchInscripciones]); 

    const handleReactivateAlumno = useCallback(async (legajo: number) => {
        if (!window.confirm(`¿Reactivar al alumno ${legajo}?`)) return;
        try {
            await apiClient.patch(`/alumnos/${legajo}/reactivate`);
            fetchAlumnos(); 
            fetchInscripciones();
        } catch (err) {
            console.error('Error al reactivar alumno:', err);
        }
    }, [fetchAlumnos, fetchInscripciones]);

    // --- Lógica de Cursos ---
    const handleDeactivateCurso = useCallback(async (id: number) => { 
        if (!window.confirm(`¿Dar de baja al curso ${id}?`)) return; 
        try { 
            await apiClient.delete(`/cursos/${id}`); 
            fetchCursos(); 
            fetchInscripciones();
        } catch (err) { 
            console.error('Error al dar de baja al curso:', err); 
        } 
    }, [fetchCursos, fetchInscripciones]); 

    const handleReactivateCurso = useCallback(async (id: number) => {
        if (!window.confirm(`¿Reactivar al curso ${id}?`)) return;
        try {
            await apiClient.patch(`/cursos/${id}/reactivate`);
            fetchCursos();
            fetchInscripciones();
        } catch (err) {
            console.error('Error al reactivar curso:', err);
        }
    }, [fetchCursos, fetchInscripciones]);

    const handleRetirarInscripcion = useCallback(async (id: number) => {
       if (!window.confirm(`¿Retirar al alumno de esta inscripción (ID: ${id})? La inscripción cambiará su estado a "Retirado".`)) return;
        try {
            await apiClient.delete(`/inscripciones/${id}`); 
            fetchInscripciones(); 
        } catch (err) {
            console.error('Error al retirar inscripción:', err);
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
            <AppBar position="fixed" color="secondary" sx={{ top: 0, zIndex: 1100, width: '100%' }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
                    >
                        Gestor De Cursos
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={() => handleMenuClickAndNavigate('/')}><Typography textAlign="center">Inicio</Typography></MenuItem>
                            <MenuItem onClick={() => handleMenuClickAndNavigate('/inscripciones')}><Typography textAlign="center">Inscripciones</Typography></MenuItem>
                            <MenuItem onClick={() => handleMenuClickAndNavigate('/profesores')}><Typography textAlign="center">Profesores</Typography></MenuItem>
                            <MenuItem onClick={() => handleMenuClickAndNavigate('/cursos')}><Typography textAlign="center">Cursos</Typography></MenuItem>
                            <MenuItem onClick={() => handleMenuClickAndNavigate('/alumnos')}><Typography textAlign="center">Alumnos</Typography></MenuItem>
                        </Menu>
                    </Box>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        Gestor De Cursos
                    </Typography>

                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>
                        <Tabs value={activeTabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
                        <Tab label="Inicio" value={0} component={Link} to="/" />
                        <Tab label="Inscripciones" value={1} component={Link} to="/inscripciones" />
                        <Tab label="Profesores" value={2} component={Link} to="/profesores" />
                        <Tab label="Cursos" value={3} component={Link} to="/cursos" />
                        <Tab label="Alumnos" value={4} component={Link} to="/alumnos" />
                        </Tabs>
                    </Box>

                </Toolbar>
            </AppBar>
            <Toolbar /> 

            <Container maxWidth={false} disableGutters sx={{ p: 3 }}>
                <Routes>
                    <Route path="/" element={<DashboardView
                        inscripciones={inscripciones} loadingInscripciones={loadingInscripciones} errorInscripciones={errorInscripciones}
                        profesores={profesores} alumnos={alumnos} cursos={cursos} onEstadoCambiado={handleInscripcionCreada}
                        onDeleteInscripcion={handleRetirarInscripcion} 
                    />} />
                    <Route path="/inscripciones" element={<GestionInscripcionesView
                        inscripciones={inscripciones} loading={loadingInscripciones} error={errorInscripciones}
                        onInscripcionCreada={handleInscripcionCreada} onEstadoCambiado={handleInscripcionCreada}
                        onDeleteInscripcion={handleRetirarInscripcion} 
                        keyInscripcionForm={keyInscripcionForm}
                    />} />
                    
                    <Route path="/profesores" element={<GestionProfesoresView
                        profesores={profesores} loading={loadingProfesores} error={errorProfesores}
                        onProfesorCreado={handleProfesorCreado} 
                        onDeactivateProfesor={handleDeactivateProfesor}
                        onReactivateProfesor={handleReactivateProfesor}
                    />} />

                    <Route path="/cursos" element={<GestionCursosView
                     cursos={cursos} loading={loadingCursos} error={errorCursos}
                        onCursoCreado={handleCursoCreado} 
                        onDeactivateCurso={handleDeactivateCurso}
                      onReactivateCurso={handleReactivateCurso}
                   />} />
                    
                    <Route path="/alumnos" element={<GestionAlumnosView
                      alumnos={alumnos} loading={loadingAlumnos} error={errorAlumnos}
                        onAlumnoCreado={handleAlumnoCreado} 
                        onDeactivateAlumno={handleDeactivateAlumno}
                      onReactivateAlumno={handleReactivateAlumno}
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