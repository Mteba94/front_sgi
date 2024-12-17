import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseApiResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { environment as env } from "src/environments/environment";
import { ListGradoSacerdotalRequest } from '../models/list-gradoSacerdotal-request.interface';
import { map } from 'rxjs/operators';
import { GradoSacerdotalResponse } from './gradoSacerdotal-response.interface';
import { getIcon } from '@shared/functions/helpers';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(
    private _http: HttpClient,
  ) { }

  GetAll(size, sort, order, page, getInputs): Observable<BaseApiResponse> {
      const requestUrl = `${env.api}${endpoint.CATEGORIA_SACERDOTE_LIST}`;
      const params: ListGradoSacerdotalRequest = new ListGradoSacerdotalRequest(
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
          data.data.items.forEach(function (sac: GradoSacerdotalResponse) {
            sac.icEdit = getIcon("icEdit", "Editar Sacerdote", sac.csEStado != 0, "edit");
            sac.icDelete = getIcon("icDelete", "Eliminar Sacerdote", sac.csEStado != 0, "delete")
            sac.icFirma = getIcon("icSignature", "Firma", sac.csEStado != 0, "firma");
          });
          return data;
        })
      );
    }
}