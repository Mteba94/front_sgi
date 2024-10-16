export interface Rol {
    roIdRol: number;
    roNombre: string;
    roDescripcion: string;
    roEstado: number;
  }

export interface RolAssing {
    userId: number,
    roleId: number
}