import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileToUpload } from './FileToUpload';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(private http: HttpClient) { }

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    uploadFile(theFile: FileToUpload): Observable<any> {
        return this.http.post<FileToUpload>(`${environment.urls.api}projects`, theFile, this.httpOptions);
    }
}
