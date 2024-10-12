import { DateTime } from "luxon";

export interface UserResponse {
    usIdUsuario: number,
    usUserName: string,
    usPass: string,
    usImage: string,
    usNombre: string,
    usFechaNacimiento: Date,
    usDireccion: string,
    usCreateDate: DateTime,
    usEstado: number,
    estadoDescripcion: string
}