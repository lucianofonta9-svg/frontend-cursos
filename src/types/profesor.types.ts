// Esta interface es el "espejo" de tu entidad Profesor en el backend
export interface IProfesor {
  legajoProfesor: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  especialidades?: string;
  fechaNacimiento: string; // Recibimos la fecha como string
  activo: boolean;
}


// Crear
// (Nota: No incluye 'legajoProfesor' porque lo genera el backend)
export interface ICreateProfesorDto {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento: string; // Debe ser string YYYY-MM-DD
  telefono?: string;
  especialidades?: string;
}