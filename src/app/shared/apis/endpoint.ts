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

    //Document Type Module
    SELECT_DOCUMENT_TYPE: 'TipoDocumento/Select',

    //Sex Type Module
    SELECT_SEX_TYPE: 'TipoSexo/Select',

    //Constancias
    CONSTANCIA_LIST: 'HistConstancia',
    CONSTANCIA_GENERATE: 'Certification',
    CONSTANCIA_HISTORY_REGISTER: 'HistConstancia/Register',
    CONSTANCIA_GENERATE_CORRELATIVO: 'HistConstancia/Correlativo/',

    //Dashboard
    CANTIDAD_SACRAMENTOS: 'Dashboard/CantidadSacramentos',

    //User
    USER_LIST: 'Usuario/',
    USER_UPDATE: 'Usuario/Update/',
    USERS_ALL: 'Usuario/List'

}

export const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
}