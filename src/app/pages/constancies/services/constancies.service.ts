import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import {
  BaseApiResponse,
  BaseResponse,
} from "@shared/models/base-api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { ConstanciaRequest } from "../models/constancia-request.interface";
import { HistConstanciaRequest } from "../models/histConstancia-request.interface";
import { ListConstanciaRequest } from "../models/list-constancia-request.interface";
import { ConstanciaResponse } from "../models/constancia-response.interface";
import { getIcon } from "@shared/functions/helpers";
import { SacerdoteResponse } from "../../sacerdotes/models/sacerdote-response.interface";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ConstanciesService {
  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) {}

  GetAll(size, sort, order, page, getInputs): Observable<BaseApiResponse> {
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_LIST}`;
    const params: ListConstanciaRequest = new ListConstanciaRequest(
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
        data.data.items.forEach(function (sac: ConstanciaResponse) {
          switch (sac.ct_Estado) {
            case 0:
              sac.badgeColor = 'text-gray bg-gray-light'
              break;
            case 1:
              sac.badgeColor = 'text-green bg-green-light'
              break;
            default:
              sac.badgeColor = 'text-gray bg-gray-light'
              break;
          }
          sac.icCloudDownload = getIcon(
            "icCloudDownload",
            "Generar Nueva Constancia",
            true,
            "constancia"
          );
          sac.icContractDelete = getIcon(
            "icContractDelete",
            "Anular Constancia",
            sac.ct_Estado !== 0 && canEdit,
            "anular"
          );
        });
        return data;
      })
    );
  }
  constancieGenerate(constancia: ConstanciaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_GENERATE}`;
    return this._http.post(requestUrl, constancia).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  genarateCorrelativo(sacramentoId: number): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_GENERATE_CORRELATIVO}${sacramentoId}`;
    return this._http.post(requestUrl, { sacramentoId }).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  histConstanciaRegister(
    histConstancia: HistConstanciaRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_HISTORY_REGISTER}`;
    return this._http.post(requestUrl, histConstancia).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  firmaSelect(): Observable<SacerdoteResponse[]> {
    const requestUrl = `${env.api}${endpoint.FIRMA_SELECT}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  constancieAnular(constanciaId: number, constancia: HistConstanciaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_ANULAR}${constanciaId}`;
    return this._http.put(requestUrl, constancia).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }
}
