import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay, finalize, map, tap } from 'rxjs/operators';
import { SharedService } from 'app/modules/shared/sharedService';
import { environment } from '../../environments/environment';
import { User } from 'app/Dto/User';
import { Router } from '@angular/router';

interface LoginResult {
  id: string;
  username: string;
  role: number;
  originalUserName: string;
  accessToken: string;
  refreshToken: string;
}
@Injectable({
  providedIn: 'root'
})


export class AuthenticationService implements OnDestroy {
  private readonly apiUrl = `${environment.urls.api}account`;
  private timer: Subscription = new Subscription;
  private _user = new BehaviorSubject<User|null>(null);
  user$: Observable<User|null> = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.stopTokenTimer();
        this._user.next(null);
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        this.http.get<LoginResult>(`${this.apiUrl}/user`).subscribe((x) => {
            this._user.next({
            id: x.id,
            userName: x.username,
            role: x.role,
            normalizedUserName: x.originalUserName,
          });
        });
      }
    }
  }

  constructor(private http: HttpClient, private shared: SharedService,private router: Router) { }

  ////////////////////

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResult>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((x) => {
          this._user.next({
            id: x.id,
            userName: x.username,
            role: x.role,
            normalizedUserName: x.originalUserName,
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  logout() {
    this.http
      .post<unknown>(`${this.apiUrl}/logout`, {})
      .pipe(
        finalize(() => {
          this.clearLocalStorage();
          this._user.next(null);
          this.stopTokenTimer();
          this.router.navigate(['login']);
        })
      )
      .subscribe();
  }

  refreshToken() {
   
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
   
      this.clearLocalStorage();
      return EMPTY; 
    }
  

    return this.http
      .post<LoginResult>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map((x) => {
          this._user.next({
            id: x.id,
            userName: x.username,
            role: x.role,
            normalizedUserName: x.originalUserName,
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
    localStorage.setItem('UserName', x.username);
    this.shared.UserName = x.username;
    this.shared.isAuthorized = true;
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('UserName');
    this.shared.UserName = "";
    this.shared.isAuthorized = false;
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.refreshToken())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }

  ///////////////////

  public register(username: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.urls.api}authentication/register`, { username, password });
  }

}