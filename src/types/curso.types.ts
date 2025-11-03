import { type IProfesor } from './profesor.types'; // Necesario para la relación en ICurso

// Interface para CREAR un Curso (lo que enviamos al backend)
export interface ICreateCursoDto {
  nombre: string;
  descripcion?: string;
  duracion: number;
  profesorLegajo: number; // Campo clave
}

// Interface para LEER un Curso (lo que devuelve el backend)
export interface ICurso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  activo: boolean;
  
  // Relación con Profesor (la entidad cargada)
  profesor?: IProfesor;
  profesorLegajo?: number; // Clave foránea
}
