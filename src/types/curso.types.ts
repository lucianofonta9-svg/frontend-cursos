import { type IProfesor } from './profesor.types'; 

export interface ICreateCursoDto {
  nombre: string;
  descripcion?: string;
  duracion: number;
  profesorLegajo: number; 
}

export interface ICurso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  activo: boolean;

  profesor?: IProfesor;
  profesorLegajo?: number; 
}
