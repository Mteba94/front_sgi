import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { endpoint, httpOptions } from '@shared/apis/endpoint';
import { map } from 'rxjs/operators';
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
    const storedToken = localStorage.getItem("token");
    this.user = new BehaviorSubject<BaseResponse>(storedToken ? JSON.parse(storedToken) : null);
   }

  login(req: Login):Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.GENERATE_TOKEN}`
    return this.http.post<BaseResponse>(requestUrl, req, httpOptions).pipe(
      map((resp: BaseResponse) => {
        if(resp.isSuccess){
          console.log("Response data:", resp.data);
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

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }

  public hasRole(allowedRoles: string[]): boolean {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return allowedRoles.some(role => rolesArray.includes(role));
      } else {
        console.log("El token decodificado no contiene roles.");
      }
    } else {
      console.log("No se encontró un token válido.");
    }
    
    return false;
  }


  public isAuthenticated(): boolean {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) return false;

    const token = JSON.parse(tokenData).token;
    const decodedToken = this.decodeToken(token);
    
    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    }
    return false;
  }
  
}
