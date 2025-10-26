import { useState, useEffect } from 'react';
import apiClient from '../apiService';
import { type IProfesor } from '../types/profesor.types.ts';

// Importaciones de MUI
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress, // Para el indicador de carga
  Alert // Para mostrar errores
} from '@mui/material';

export function ListaProfesores() {
  const [profesores, setProfesores] = useState<IProfesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setLoading(true); 
        const response = await apiClient.get<IProfesor[]>('/profesores');
        setProfesores(response.data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los profesores.');
      } finally {
        setLoading(false); 
      }
    };
    fetchProfesores();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" sx={{ padding: 2 }}>
        Lista de Profesores
      </Typography>

      {profesores.length === 0 ? (
        <Typography sx={{ padding: 2 }}>No hay profesores para mostrar.</Typography>
      ) : (
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Legajo</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DNI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((prof) => (
              <TableRow key={prof.legajoProfesor}>
                <TableCell>{prof.legajoProfesor}</TableCell>
                <TableCell>{prof.nombre} {prof.apellido}</TableCell>
                <TableCell>{prof.email}</TableCell>
                <TableCell>{prof.dni}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}