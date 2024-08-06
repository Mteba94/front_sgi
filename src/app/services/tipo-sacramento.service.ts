import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { tipoSacramento, tipoSacramentoApi } from '../responses/tipoSacramento/tiposacramento.response';
import { environment as env } from 'src/environments/environment';
import { endpoint } from '@shared/apis/endpoint';
import { ListTipoSacramentoRequest } from '../requests/tipoSacramento/list-tiposacramento.request';
import { map } from 'rxjs/operators';
import { da } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { TipoSacramentoRequest } from '../requests/tipoSacramento/tipoSacramento.request';
import { ApiResponse } from '../commons/response.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoSacramentoService {

  constructor(
    private _http: HttpClient,
    private _alert: AlertService
  ) { }

  GetAll(
    size,
    sort,
    order,
    page,
    getInputs
  ): Observable<tipoSacramentoApi> {
    const requestUrl = `${env.api}${endpoint.LIST_TIPO_SACRAMENTO}`
    const params: ListTipoSacramentoRequest = new ListTipoSacramentoRequest(
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
    return this._http.post<tipoSacramentoApi>(requestUrl, params).pipe(
      map((data: tipoSacramentoApi) => {
        data.data.items.forEach(function(e: any){
          switch (e.tsEstado) {
            case 0:
              e.badgeColor = 'text-gray bg-gray-light'
              break;
            case 1:
              e.badgeColor = 'text-green bg-green-light'
              break;
            default:
              e.badgeColor = 'text-gray bg-gray-light'
              break;
          }
        })
        //console.log(data.data.items)
        return data
      })
    )
  }

  TipoSacramentoRegister(Tsacramento: TipoSacramentoRequest):Observable<ApiResponse>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_REGISTER}`
    return this._http.post(requestUrl, Tsacramento).pipe(
      map((resp: ApiResponse) => {
        return resp
      })
    )
  }

  TipoSacramentoById(TipoSacramentoId: number):Observable<tipoSacramento>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_BY_ID}${TipoSacramentoId}`
    return this._http.get(requestUrl).pipe(
      map((resp: ApiResponse) => {
        return resp.data
      })
    )
  }

  TipoSacramentoEdit(TipoSacramentoId: number, Tsacramento: TipoSacramentoRequest):Observable<ApiResponse>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_UPDATE}${TipoSacramentoId}`
    return this._http.put(requestUrl, Tsacramento).pipe(
      map((resp: ApiResponse) => {
        return resp
      })
    )
  }

  TipoSacramentoDelete(TipoSacramentoId: number):Observable<void>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_DELETE}${TipoSacramentoId}`
    return this._http.put(requestUrl, '').pipe(
      map((resp: ApiResponse) => {
        if(resp.isSuccess){
          this._alert.success("Excelente", resp.message);
        }
      })
    )
  }
}
