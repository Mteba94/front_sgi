import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseApiResponse, BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ConstanciaRequest } from '../models/constancia-request.interface';
import { HistConstanciaRequest } from '../models/histConstancia-request.interface';
import { ListConstanciaRequest } from '../models/list-constancia-request.interface';
import { ConstanciaResponse } from '../models/constancia-response.interface';
import { getIcon } from '@shared/functions/helpers';

@Injectable({
  providedIn: 'root'
})
export class ConstanciesService {

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
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_LIST}`
    const params: ListConstanciaRequest = new ListConstanciaRequest (
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
          data.data.items.forEach(function(sac: ConstanciaResponse){
            sac.icCloudDownload = getIcon("icCloudDownload", "Generar Nueva Constancia", true, "constancia")
          })
          return data;
        })
      )
  }
  constancieGenerate(constancia: ConstanciaRequest):Observable<BaseResponse>{
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_GENERATE}`
    return this._http.post(requestUrl, constancia).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  genarateCorrelativo(sacramentoId: number):Observable<BaseResponse>{
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_GENERATE_CORRELATIVO}${sacramentoId}`
    return this._http.post(requestUrl, {sacramentoId}).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  histConstanciaRegister(histConstancia: HistConstanciaRequest):Observable<BaseResponse>{
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_HISTORY_REGISTER}`
    return this._http.post(requestUrl, histConstancia).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }
}
