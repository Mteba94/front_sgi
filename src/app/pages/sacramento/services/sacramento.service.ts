import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseApiResponse, BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { ListSacramentoRequest } from '../models/list-sacramento-request.interface';
import { map } from 'rxjs/operators';
import { SacramentoResponse } from '../models/sacramento-response.interface';
import { getIcon } from '@shared/functions/helpers';
import { sacramentoRequest } from '../models/sacramento-request.interface';
import { matrimonioRequest } from '../models/matrimonio-request.interface';
import { MatrimonioResponse } from '../models/matrimonio-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SacramentoService {

  constructor(
    private _http: HttpClient
  ) { }

  GetAll(
      size,
      sort,
      order,
      page,
      getInputs
    ):Observable<BaseApiResponse> {
      const requestUrl = `${env.api}${endpoint.lIST_SACRAMENTO}`
      const params: ListSacramentoRequest = new ListSacramentoRequest (
        page + 1,
        order,
        sort,
        size,
        getInputs.numFilter,
        getInputs.textFilter,
        getInputs.stateFilter,
        getInputs.startDate,
        getInputs.endDate
      )
      return this._http.post<BaseApiResponse>(requestUrl, params).pipe(
        map((data: BaseApiResponse) => {
          data.data.items.forEach(function(sac: SacramentoResponse){
            sac.icEdit = getIcon("icEdit", "Editar Sacramento", true, "edit")
            sac.icCloudDownload = getIcon("icCloudDownload", "Generar Constancia", true, "constancia")
          })
          return data;
        })
      )
  }

  TipoSacramentoSelect():Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.SELECT_TIPO_SACRAMENTO}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  SacramentoById(SacramentoId: number):Observable<SacramentoResponse>{
    const requestUrl =  `${env.api}${endpoint.SACRAMENTO_BY_ID}${SacramentoId}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }

  MatrimonioById(SacramentoId: number):Observable<MatrimonioResponse>{
    const requestUrl =  `${env.api}${endpoint.MATRIMONIO_BY_ID}${SacramentoId}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }

  SacramentoRegister(Sacramento: sacramentoRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.SACRAMENTO_REGISTER}`
    return this._http.post(requestUrl, Sacramento).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  MatrimonioRegister(Matrimonio: matrimonioRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.MATRIMONIO_REGISTER}`
    return this._http.post(requestUrl, Matrimonio).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  SacramentoEdit(SacramentId: number, Sacramento: sacramentoRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.SACRAMENTO_UPDATE}${SacramentId}`
    return this._http.put<BaseResponse>(requestUrl, Sacramento);
  }

  MatrimonioEdit(SacramentoId: number, Matrimonio: matrimonioRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.MATRIMONIO_UPDATE}${SacramentoId}`
    return this._http.put<BaseResponse>(requestUrl, Matrimonio);
  }
}
