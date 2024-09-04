import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { SexType } from '@shared/models/sex-type.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SexTypeService {


  constructor(
    private http: HttpClient,
  ) { }

  listSexType(): Observable<SexType[]> {
    const requestUrl = `${env.api}${endpoint.SELECT_SEX_TYPE}`;
    return this.http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }
}
