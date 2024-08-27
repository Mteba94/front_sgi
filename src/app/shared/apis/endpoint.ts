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
    SACRAMENTO_REGISTER: 'Sacramento/Register',
    SACRAMENTO_UPDATE: 'Sacramento/Update/',

    //Document Type Module
    SELECT_DOCUMENT_TYPE: 'TipoDocumento/Select',
}

export const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
}