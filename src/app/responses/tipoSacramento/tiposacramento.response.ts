export interface tipoSacramento{
    TsIdTIpoSacramento: number
    TsNombre: string
    TsDescripcion: string
    TsRequerimiento: string
    TsCreateDate: Date
    TsEstado: number
    EstadoDescripcion: string
}

export interface tipoSacramentoApi{
    data: any
    totalRecords: number
}