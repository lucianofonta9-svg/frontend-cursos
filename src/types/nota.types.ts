export interface INota {
  id: number;
  nombreEvaluacion: string;
  calificacion: number; 
  fechaRegistro: string;
  inscripcionId: number;

}


export interface ICreateNotaDto {
  nombreEvaluacion: string;
  calificacion: number;
  inscripcionId: number; 
}
