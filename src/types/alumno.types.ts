// Para leer datos
export interface IAlumno {
  legajoAlumno: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  dni: string;
  email: string;
  telefono?: string;
  activo: boolean;
  // inscripciones: any[]; // Omitimos por ahora
}

// Para crear datos (sin legajo ni activo)
export interface ICreateAlumnoDto {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // YYYY-MM-DD
  dni: string;
  email: string;
  telefono?: string;
}