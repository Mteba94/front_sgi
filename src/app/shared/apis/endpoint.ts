import { HttpHeaders } from "@angular/common/http"
import { he } from "date-fns/locale"

export const endpoint = {
    //Tipo Sacramento
    LIST_TIPO_SACRAMENTO: 'TipoSacramento',
    SELECT_TIPO_SACRAMENTO: 'TipoSacramento/Select',
    TIPO_SACRAMENTO_BY_ID: 'TipoSacramento/',
    TIPO_SACRAMENTO_REGISTER: 'TipoSacramento/Register',
    TIPO_SACRAMENTO_UPDATE: 'TipoSacramento/Update/',
    TIPO_SACRAMENTO_DELETE: 'TipoSacramento/Remove/',

    //Auth Module
    GENERATE_TOKEN: 'Usuario/Generate/Token',

    //Sacramento Module
    lIST_SACRAMENTO: 'Sacramento',
    SACRAMENTO_BY_ID: 'Sacramento/',
    MATRIMONIO_BY_ID: 'Sacramento/Matrimonio/',
    SACRAMENTO_REGISTER: 'Sacramento/Register',
    MATRIMONIO_REGISTER: 'Sacramento/Register/Matrimonio',
    SACRAMENTO_UPDATE: 'Sacramento/Update/',
    MATRIMONIO_UPDATE: 'Sacramento/Update/Matrimonio/',
    SACRAMENTO_DELETE: 'Sacramento/Delete/',
    MATRIMONIO_DELETE: 'Sacramento/Delete/Matrimonio/',

    //Document Type Module
    SELECT_DOCUMENT_TYPE: 'TipoDocumento/Select',

    //Sex Type Module
    SELECT_SEX_TYPE: 'TipoSexo/Select',

    //Constancias
    CONSTANCIA_LIST: 'HistConstancia',
    CONSTANCIA_GENERATE: 'Certification',
    CONSTANCIA_HISTORY_REGISTER: 'HistConstancia/Register',
    CONSTANCIA_GENERATE_CORRELATIVO: 'HistConstancia/Correlativo/',
    CONSTANCIA_ANULAR: 'HistConstancia/Anular/',

    //Dashboard
    CANTIDAD_SACRAMENTOS: 'Dashboard/CantidadSacramentos',

    //User
    USER_LIST: 'Usuario/',
    USER_UPDATE: 'Usuario/Update/',
    USERS_ALL: 'Usuario/List',
    USER_CREATE: 'Usuario/Register',
    USER_RETSET: 'Usuario/Reset/',

    //Rol
    ROL_SELECT: 'Rol/Select',

    //User-Rol
    ROL_ASSIGN: 'UserRol/Assign/',

    //Sacerdotes
    SACERDOTE_LIST: 'Sacerdote/List',
    SACERDOTE_SELECT: 'Sacerdote/Select',
    SACERDOTE_BY_ID: 'Sacerdote/',
    SACERDOTE_REGISTER: 'Sacerdote/Register',
    SACERDOTE_UPDATE: 'Sacerdote/Update/',
    SACERDOTE_DELETE: 'Sacerdote/Delete/',

    //Categoria Sacerdote
    CATEGORIA_SACERDOTE_LIST: 'CategoriaSacerdote/List',
    CATEGORIA_SACERDOTE_SELECT: 'CategoriaSacerdote/Select',
    CATEGORIA_SACERDOTE_BY_ID: 'CategoriaSacerdote/',
    CATEGORIA_SACERDOTE_REGISTER: 'CategoriaSacerdote/Register',
    CATEGORIA_SACERDOTE_UPDATE: 'CategoriaSacerdote/Update/',
    CATEGORIA_SACERDOTE_DELETE: 'CategoriaSacerdote/Delete/',

    //Firma
    FIRMA_REGISTER: 'Firma/RegisterFirma/',
    FIRMA_SELECT: 'Firma/ListSelectFirma'

}

export const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
}