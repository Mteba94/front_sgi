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

        if(userToken){
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${userToken}`
                }
            })
        }

        return next.handle(req).pipe(
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