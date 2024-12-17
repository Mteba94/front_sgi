import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { CatSacerdote } from '@shared/models/cat-sacerdote.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatSacerdoteService {

  constructor(
    private http: HttpClient,
  ) { }

  listCatSacerdote():Observable<CatSacerdote[]> {
    const requestUrl = `${env.api}${endpoint.CATEGORIA_SACERDOTE_SELECT}`;
    return this.http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }
}
