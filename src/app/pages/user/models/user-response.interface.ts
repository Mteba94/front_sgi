import { DateTime } from "luxon";

export interface UserResponse {
    usIdUsuario: number,
    usUserName: string,
    usPass: string,
    usImage: string,
    usNombre: string,
    usIdGenero: number,
    usFechaNacimiento: Date,
    usIdTipoDocumento: number,
    usNumerodocumento: string,
    usDireccion: string,
    usCreateDate: DateTime,
    usEstado: number,
    estadoDescripcion: string,
    icEdit: any,
}

export interface UserRequest {
    usUserName: string,
    usPass: string,
    usImage: string,
    usNombre: string,
    usFechaNacimiento: DateTime,
    usIdTipoDocumento: number,
    usNumerodocumento: string,
    usIdGenero: number,
    usDireccion: string
}