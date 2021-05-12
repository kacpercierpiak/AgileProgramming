import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import {MatButtonModule} from '@angular/material/button';
import { SharedService } from '../shared/sharedService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username: string = "";
  public password: string = "";
  public error: string = "";

  public returnUrl?: string;

  constructor(private authentication: AuthenticationService,
    private route: ActivatedRoute,private shared: SharedService,
    private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
  }

  // Login the user, if an error occurs display if on the page
  public onSubmit() {
  
    this.error = "";
    this.authentication.login(this.username, this.password).subscribe(() => {
      this.shared.UserName = this.username;
      this.shared.isAuthorized = true;
      this.router.navigate([this.returnUrl]);
    }, (error: HttpErrorResponse) => {
      if (error && error.error) {
        this.error = error.error;
      }
      alert(this.error);
    });
  }
}