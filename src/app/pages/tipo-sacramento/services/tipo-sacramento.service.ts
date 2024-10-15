import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { tipoSacramento } from '../models/tiposacramento.response';
import { environment as env } from 'src/environments/environment';
import { endpoint } from '@shared/apis/endpoint';
import { ListTipoSacramentoRequest } from '../models/list-tiposacramento.request';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TipoSacramentoRequest } from '../models/tipoSacramento.request';
import { getIcon } from '@shared/functions/helpers';
import { BaseApiResponse, BaseResponse } from '@shared/models/base-api-response.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TipoSacramentoService {

  constructor(
    private _http: HttpClient,
    private _alert: AlertService,
    private _authService: AuthService
  ) { }

  GetAll(
    size,
    sort,
    order,
    page,
    getInputs
  ): Observable<BaseApiResponse> {
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
    return this._http.post<BaseApiResponse>(requestUrl, params).pipe(
      map((data: BaseApiResponse) => {
        const canEdit = this._authService.hasRole(['Administrador'])
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
          e.icEdit = getIcon("icEdit", "Editar Tipo Sacramento", canEdit, "edit");
          e.icDelete = getIcon("icDelete", "Eliminar Tipo Sacramento", canEdit, "remove")
        })
        //console.log(data.data.items)
        return data
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

  TipoSacramentoRegister(Tsacramento: TipoSacramentoRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_REGISTER}`
    return this._http.post(requestUrl, Tsacramento).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  TipoSacramentoById(TipoSacramentoId: number):Observable<tipoSacramento>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_BY_ID}${TipoSacramentoId}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }

  TipoSacramentoEdit(TipoSacramentoId: number, Tsacramento: TipoSacramentoRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_UPDATE}${TipoSacramentoId}`
    return this._http.put(requestUrl, Tsacramento).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

  TipoSacramentoDelete(TipoSacramentoId: number):Observable<void>{
    const requestUrl =  `${env.api}${endpoint.TIPO_SACRAMENTO_DELETE}${TipoSacramentoId}`
    return this._http.put(requestUrl, '').pipe(
      map((resp: BaseResponse) => {
        if(resp.isSuccess){
          this._alert.success("Excelente", resp.message);
        }
      })
    )
  }
}
