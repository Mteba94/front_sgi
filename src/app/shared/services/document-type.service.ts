import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { DocumentType } from '@shared/models/document-type.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(
    private _http: HttpClient,
  ) { }

  listDocumentType():Observable<DocumentType[]>{
    const requestUrl = `${env.api}${endpoint.SELECT_DOCUMENT_TYPE}`
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data
      })
    )
  }
}
