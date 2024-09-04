import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ConstanciaRequest } from '../models/constancia-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ConstanciesService {

  constructor(
    private _http: HttpClient
  ) { }

  constancieGenerate(constancia: ConstanciaRequest):Observable<BaseResponse>{
    const requestUrl = `${env.api}${endpoint.CONSTANCIA_GENERATE}`
    return this._http.post(requestUrl, constancia).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }
}
