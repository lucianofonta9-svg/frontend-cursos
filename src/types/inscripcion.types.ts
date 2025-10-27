import { type IAlumno } from './alumno.types';
import { type ICurso } from './curso.types';

// Omitimos IProfesor, ICreateProfesorDto, etc. por brevedad en la respuesta
// Asumo que ya definiste IAlumno y ICurso en sus respectivos archivos.

// --- Tipos de Estado ---
export type EstadoInscripcion = 'INSCRITO' | 'ACTIVO' | 'COMPLETADO' | 'RETIRADO';

// --- DTO para CREAR una Inscripción (Lo que se envía al backend) ---
export interface ICreateInscripcionDto {
  alumnoLegajo: number;
  cursoId: number;
}

// --- Interface para LEER una Inscripción (Lo que devuelve el backend) ---
// Esta estructura espejea la entidad del backend con sus relaciones cargadas.
export interface IInscripcion {
  id: number;
  
  // Claves Foráneas (datos simples)
  alumnoLegajo: number;
  cursoId: number;
  estado: EstadoInscripcion;
  
  // Relaciones cargadas (objetos anidados)
  alumno: IAlumno;
  curso: ICurso;
  
  // Nota: Faltaría el array de 'notas', pero lo omitimos por ahora para simplificar
  notas?: any[]; 
}