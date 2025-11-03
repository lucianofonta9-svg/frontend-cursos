import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Importaciones de MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 2. (Opcional) Crea un tema básico
const theme = createTheme({
  palette: {
    mode: 'light', // O 'dark' si prefieres
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Envuelve tu App con el Provider */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetea los estilos base */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);