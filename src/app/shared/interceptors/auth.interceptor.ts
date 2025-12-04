import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const userToken = this.authService.userToken
        let authReq = req;

        if(userToken){
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${userToken}`
                }
            })
        }

        if (authReq.body instanceof FormData) {
            authReq = authReq.clone({
                headers: authReq.headers.delete('Content-Type')
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status === 401){
                    this.authService.logout();
                    this.router.navigate(['login']);
                }
                return throwError(() => error)
            })
        )
    }
}