import { DateTime } from "luxon";
import { SacramentoResponse } from "./sacramento-response.interface";

export interface sacramentoRequest {
    scNumeroPartida: string,
    scIdTipoSacramento: number,
    scMatrimonioId: number,
    peNombre: string,
    peEdad: string,
    peFechaNacimiento: Date,
    peIdTipoDocumento: number,
    peNumeroDocumento: string,
    peSexoId: number,
    peDireccion: string,
    scPadre: string,
    scMadre: string,
    scPadrino: string,
    scMadrina: string,
    scParroco: string,
    scFechaSacramento: Date,
    scObservaciones: string,
    scLugarBautizo: string
}

export function transformResponseToRequest(response: SacramentoResponse): sacramentoRequest {
    return {
        scNumeroPartida: response.scNumeroPartida,
        scIdTipoSacramento: response.scIdTipoSacramento,
        scMatrimonioId: response.scMatrimonioId,
        peNombre: response.peNombre,
        peEdad: response.peEdad.toString(), // convertir número a cadena
        peFechaNacimiento: response.peFechaNacimiento,
        peIdTipoDocumento: response.peIdTipoDocumento,
        peNumeroDocumento: response.peNumeroDocumento,
        peSexoId: response.peSexoId,
        peDireccion: response.peDireccion,
        scPadre: response.scNombrePadre,
        scMadre: response.scNombreMadre,
        scPadrino: response.scNombrePadrino,
        scMadrina: response.scNombreMadrina,
        scParroco: response.scParrocoId.toString(), // convertir número a cadena si es necesario
        scFechaSacramento: response.scFechaSacramento,
        scObservaciones: response.scObservaciones,
        scLugarBautizo: response.scLugarBautizo
    }
}