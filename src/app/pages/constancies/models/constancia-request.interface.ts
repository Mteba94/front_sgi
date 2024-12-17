export interface ConstanciaRequest{
    idTipoSacramento: number;
    tipoSacramento: string;
    numero: string;
    folio: string;
    partida: string;
    correlativo: string;
    dia: string;
    mes: string;
    anio: string;
    nombreBautizado: string;
    nombreEsposa: string;
    fechaNacimiento: string;
    fechaNacimientoEsposa: string;
    edad: number;
    nombrePadre: string;
    nombrePadreEsposa: string;
    nombreMadre: string;
    nombreMadreEsposa: string;
    nombrePadrinos: string[];
    nombreSacerdote: string;
    anotacionMarginal: string;
    diaExpedicion: string;
    mesExpedicion: string;
    anioExpedicion: string;
    sacerdoteFirma: string;
    sacerdoteCat: string;
}