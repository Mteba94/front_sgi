import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserResponse } from '../models/user-response.interface';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient
  ) { }

  getDataUser(UserName: string):Observable<UserResponse>{
    const requestUrl =  `${env.api}${endpoint.USER_LIST}${UserName}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }
}
