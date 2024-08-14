export interface tipoSacramento{
    tsIdTipoSacramento: number
    tsNombre: string
    tsDescripcion: string
    tsRequerimiento: string
    tsCreateDate: Date
    tsEstado: number
    estadoDescripcion: string
}

export interface tipoSacramentoApi{
    data: any
    totalRecords: number
}