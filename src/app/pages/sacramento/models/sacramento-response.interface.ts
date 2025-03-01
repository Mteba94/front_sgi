export interface SacramentoResponse {
    scIdSacramento: number,
    scNumeroPartida: string,
    scIdTipoSacramento: number,
    scTipoSacramento: string,
    scMatrimonioId: number,
    peNombre: string,
    peFechaNacimiento: Date,
    peNumeroDocumento: string,
    peSexoId: number,
    peIdTipoDocumento: number,
    peTipoDocumento: string,
    peDireccion: string,
    scNombrePadre: string,
    scNombreMadre: string,
    scNombrePadrino: string,
    scNombreMadrina: string,
    scFechaSacramento: Date,
    scParrocoId: number,
    scObservaciones: string,
    scCreateDate: Date,
    icEdit: any,
    icCloudDownload: any;
}