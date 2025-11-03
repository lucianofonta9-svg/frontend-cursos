import { type IAlumno } from './alumno.types';
import { type ICurso } from './curso.types';


export type EstadoInscripcion = 'INSCRITO' | 'ACTIVO' | 'COMPLETADO' | 'RETIRADO';

export interface ICreateInscripcionDto {
  alumnoLegajo: number;
  cursoId: number;
}


export interface IInscripcion {
  id: number;
  

  alumnoLegajo: number;
  cursoId: number;
  estado: EstadoInscripcion;
  

  alumno: IAlumno;
  curso: ICurso;
  
  notas?: any[]; 
}