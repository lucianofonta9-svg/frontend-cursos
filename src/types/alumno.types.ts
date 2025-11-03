
export interface IAlumno {
  legajoAlumno: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  dni: string;
  email: string;
  telefono?: string;
  activo: boolean;
}


export interface ICreateAlumnoDto {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; 
  dni: string;
  email: string;
  telefono?: string;
}