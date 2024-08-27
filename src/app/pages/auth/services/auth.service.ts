import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { endpoint, httpOptions } from '@shared/apis/endpoint';
import { map } from 'rxjs/operators';
import { AlertService } from '@shared/services/alert.service';
import { BaseResponse } from '@shared/models/base-api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<BaseResponse>;
  public get userToken(): BaseResponse{
    return this.user.value;
  }

  constructor(
    private http: HttpClient,
  ) {
    this.user = new BehaviorSubject<BaseResponse>(JSON.parse(localStorage.getItem("token")))
   }

  login(req: Login):Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.GENERATE_TOKEN}`
    return this.http.post<BaseResponse>(requestUrl, req, httpOptions).pipe(
      map((resp: BaseResponse) => {
        if(resp.isSuccess){
          localStorage.setItem("token", JSON.stringify(resp.data))
          this.user.next(resp.data)
        }
        return resp;
      })
    )
  }

  logout(){
    localStorage.removeItem("token")
    this.user.next(null);
    window.location.reload();
  }
}
