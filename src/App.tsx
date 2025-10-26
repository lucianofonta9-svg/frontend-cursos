import { FormularioProfesor } from './components/FormularioProfesor';
import { ListaProfesores } from './components/ListaProfesores';
import { Container, Typography } from '@mui/material'; // Usamos Container de MUI

function App() {
  return (
    <Container maxWidth="lg"> {/* Envuelve la app en un contenedor centrado */}
      <Typography variant="h3" component="h1" gutterBottom sx={{ marginTop: 2 }}>
        Sistema de Gestión de Cursos
      </Typography>
      <hr />
      
      {/* Carga tu primer componente */}

      <FormularioProfesor/>
      <ListaProfesores />
      


    </Container>
  );
}

export default App;