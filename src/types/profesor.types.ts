export interface IProfesor {
  legajoProfesor: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  especialidades?: string;
  fechaNacimiento: string; 
  activo: boolean;
}

export interface ICreateProfesorDto {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento: string; 
  telefono?: string;
  especialidades?: string;
}