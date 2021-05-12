import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public username: string = "";
  public password: string = "";
  public errors: string[] = [""];
 
  public returnUrl: string = "";

  constructor(private authentication: AuthenticationService, private router: Router) { }

  ngOnInit() {

  }

  public onSubmit() {
  
    this.errors = [];
    this.authentication.register(this.username, this.password).subscribe(() => {

 
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.error instanceof Array) {
        this.errors = error.error.map(m => m.description);
      }
      else {
        this.errors = [error.error.message];
      }
      alert(this.errors.join("\n"));
   
    }); 
  }
}