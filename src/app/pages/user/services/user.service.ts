import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseApiResponse, BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRequest, UserResponse } from '../models/user-response.interface';
import { environment as env } from 'src/environments/environment';
import { ListUserRequest } from '../models/list-user-request.interface';
import { getIcon } from '@shared/functions/helpers';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  GetAll(
    size,
    sort,
    order,
    page,
    getInputs
  ):Observable<BaseApiResponse> {
    const requestUrl = `${env.api}${endpoint.USERS_ALL}`
    const params: ListUserRequest = new ListUserRequest (
      page + 1,
      order,
      sort,
      size,
      getInputs.numFilter,
      getInputs.textFilter,
      getInputs.stateFilter,
      getInputs.startDate,
      getInputs.endDate
    )
    return this._http.post<BaseApiResponse>(requestUrl, params).pipe(
      map((data: BaseApiResponse) => {
        const canEdit = this._authService.hasRole(['Administrador'])
        data.data.items.forEach(function(user: UserResponse){
          user.icEdit = getIcon("icEdit", "Editar Usuario", canEdit, "edit")
          //sac.icCloudDownload = getIcon("icCloudDownload", "Generar Constancia", true, "constancia")
        })
        return data;
      })
    )
  }

  getDataUser(UserName: string):Observable<UserResponse>{
    const requestUrl =  `${env.api}${endpoint.USER_LIST}${UserName}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }

  updateDataUser(UserId: number, user: UserRequest):Observable<BaseResponse>{
    const requestUrl =  `${env.api}${endpoint.USER_UPDATE}${UserId}`
    return this._http.put<BaseResponse>(requestUrl, user);
  }


}
