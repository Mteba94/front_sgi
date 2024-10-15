import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomLayoutAuthComponent } from './custom-layout-auth/custom-layout-auth.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from '@shared/functions/date-format';
import { AccesDeniedComponent } from './pages/acces-denied/acces-denied.component';
import { AuthService } from './pages/auth/services/auth.service';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, CustomLayoutAuthComponent, AccesDeniedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    VexModule,
    CustomLayoutModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }