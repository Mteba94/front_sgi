import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { ListSacerdote } from '@shared/models/list-sacerdote.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SacerdoteSelectService {

  constructor(
    private http: HttpClient,
  ) { }

  listSacerdote(): Observable<ListSacerdote[]> {
    const requestUrl = `${env.api}${endpoint.SACERDOTE_SELECT}`;
    return this.http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }
}
