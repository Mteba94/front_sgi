import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseApiResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { DashboardRequest } from '../models/dashboar-request.interface';
import { map } from 'rxjs/operators';
import { CantidadSacramentosResponse } from '../models/cantsacramento-response.interface';
import { getIcon } from '@shared/functions/helpers';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private _http: HttpClient
  ) { }

  CantidadSacramentos(
      // size,
      // sort,
      // order,
      // page,
      // getInputs
      request: DashboardRequest
  ):Observable<BaseApiResponse>{
    const requestUrl = `${env.api}${endpoint.CANTIDAD_SACRAMENTOS}`

    // const params: DashboardRequest = new DashboardRequest (
    //   page + 1,
    //   order,
    //   sort,
    //   size,
    //   getInputs.numFilter,
    //   getInputs.textFilter,
    //   getInputs.stateFilter,
    //   getInputs.startDate,
    //   getInputs.endDate
    // )
    return this._http.post(requestUrl, request).pipe(
      map((data: BaseApiResponse) => {
        data.data.items.forEach(function(sac: CantidadSacramentosResponse){
          
        })
        return data;
      })
    )
  }
}
