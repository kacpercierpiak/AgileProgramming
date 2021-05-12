import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../Dto/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get<User[]>(`${environment.urls.api}authentication/users`);
  }
  public getUser(id: string) {
    return this.http.get<User>(`${environment.urls.api}authentication/user/${id}`);
  }

  public updateRole(userName: string, role: number) {
    return this.http.put<{ userName: string, role: number }>(`${environment.urls.api}authentication/user`, { userName, role });
  }

  public deleteUser(userName: string) {
    
    return this.http.delete<{ userName: string}>(`${environment.urls.api}authentication/user/${userName}`);
  }

  public getUserRole(userName: string) {
    return this.http.get<User[]>(`${environment.urls.api}authentication/users`)
      .pipe(map(result => {
        if (result) {
          var user = result.filter(function (u) {
            return u.userName.trim().toLowerCase() == userName.trim().toLowerCase();
          });
          return user[0].role;
        } else {
          return null;
        }
      }));
  }
}