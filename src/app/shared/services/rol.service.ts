import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { Rol, RolAssing } from '@shared/models/rol.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(
    private http: HttpClient,
  ) { }

  listRolType(): Observable<Rol[]> {
    const requestUrl = `${env.api}${endpoint.ROL_SELECT}`;
    return this.http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }

  assignRol(RolAssing: RolAssing):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.ROL_ASSIGN}${RolAssing.userId}/${RolAssing.roleId}`
    return this.http.post(requestUrl, RolAssing).pipe(
      map((resp: BaseResponse) => {
        return resp
      })
    )
  }

}
