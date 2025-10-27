// Usamos string para las fechas que se envían y se reciben
export interface INota {
  id: number;
  nombreEvaluacion: string;
  calificacion: number; // Decimal (ej: 8.5)
  fechaRegistro: string;
  inscripcionId: number;
  // La relación 'inscripcion' completa vendría si se carga
}

// DTO para CREAR una Nota
// (Necesitamos el ID de la inscripción a la que pertenece)
export interface ICreateNotaDto {
  nombreEvaluacion: string;
  calificacion: number;
  inscripcionId: number; // Clave foránea de la Inscripción
}
