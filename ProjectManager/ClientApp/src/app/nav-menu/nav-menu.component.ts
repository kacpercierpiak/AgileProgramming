import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit  {
  isExpanded = false;
  public waited: boolean;
  public get loaded(): boolean { return this.waited }
  public animationActive: boolean;
  public UserName:string ="";
  public isAuthenticated: Observable<boolean>;
  public userName: Observable<string>;

  constructor(private readonly router: Router, private authorizeService: AuthorizeService) {

    this.waited = false;
    this.animationActive = false;
    
  }
  

  ngOnInit(): void {
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));
    this.configureRoutingAnimation();
    setTimeout(() => {
      this.waited = true;
    }, 1200);
    
  }

  private configureRoutingAnimation(): void {
    this.router.events.subscribe((res: any) => {
      if (res.navigationTrigger) {
        this.animationActive = true;
        setTimeout(() => {
          this.animationActive = false;
        }, 400);
      }
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
