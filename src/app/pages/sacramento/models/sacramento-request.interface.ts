import { DateTime } from "luxon";

export interface sacramentoRequest {
    scNumeroPartida: string,
    scIdTipoSacramento: number,
    peNombre: string,
    peFechaNacimiento: Date,
    peIdTipoDocumento: number,
    peNumeroDocumento: string,
    peDireccion: string,
    scPadre: string,
    scMadre: string,
    scPadrino: string,
    scMadrina: string,
    scParroco: string,
    scFechaSacramento: DateTime,
    scObservaciones: string
}