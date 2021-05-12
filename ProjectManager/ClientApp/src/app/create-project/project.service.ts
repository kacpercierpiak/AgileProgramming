import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Project } from './project'

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    public create(Name: string, Description: string, CreateDateTime: Date, DeadLine: Date, isActive: boolean): Observable<Project> {
        return this.http.post<Project>(`${environment.urls.api}Projects`, { Name, Description, CreateDateTime, DeadLine, isActive });
    }
}