import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import {
  BaseApiResponse,
  BaseResponse,
} from "@shared/models/base-api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { ListSacerdoteRequest } from "../models/list-sacerdote-request.interface";
import { SacerdoteResponse } from "../models/sacerdote-response.interface";
import { SacerdoteRequest } from "../models/sacerdote-request.interface";

@Injectable({
  providedIn: "root",
})
export class SacerdoteService {
  constructor(private _http: HttpClient) {}

  GetAll(size, sort, order, page, getInputs): Observable<BaseApiResponse> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_LIST}`;
    const params: ListSacerdoteRequest = new ListSacerdoteRequest(
      page + 1,
      order,
      sort,
      size,
      getInputs.numFilter,
      getInputs.textFilter,
      getInputs.stateFilter,
      getInputs.startDate,
      getInputs.endDate
    );
    return this._http.post<BaseApiResponse>(requestUrl, params).pipe(
      map((data: BaseApiResponse) => {
        data.data.items.forEach(function (sac: SacerdoteResponse) {
          sac.icEdit = getIcon("icEdit", "Editar Sacerdote", sac.sacerdoteEstado != 0, "edit");
          sac.icDelete = getIcon("icDelete", "Eliminar Sacerdote", sac.sacerdoteEstado != 0, "delete")
          sac.icFirma = getIcon("icSignature", "Firma", sac.sacerdoteEstado != 0, "firma");
        });
        return data;
      })
    );
  }

  SacerdoteById(sacerdoteId: number): Observable<SacerdoteResponse> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_BY_ID}${sacerdoteId}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  SacerdoteRegister(sacerdote: SacerdoteRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_REGISTER}`;
    return this._http.post(requestUrl, sacerdote).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  SacerdoteUpdate(sacerdoteId: number, sacerdote: SacerdoteRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_UPDATE}${sacerdoteId}`;
    return this._http.put(requestUrl, sacerdote).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  SacerdoteDelete(sacerdoteId: number): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_DELETE}${sacerdoteId}`;
    return this._http.put(requestUrl, '').pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  SacerdoteFirma(sacerdoteId: number): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.FIRMA_REGISTER}${sacerdoteId}`;
    return this._http.post(requestUrl, '').pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }
}
