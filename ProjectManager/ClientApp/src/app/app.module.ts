import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DeleteProjectDialog, ProjectsListComponent } from './projects-list/projects-list.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { SharedModule } from './modules/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from '@angular/material/sort';

import { RegisterComponent } from './modules/register/register.component';
import { ClarityModule } from '@clr/angular';
import { LoginComponent } from './modules/login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
//import { RefreshTokenInterceptor } from './modules/refresh-token-interceptor';
import { ChatComponent } from './modules/chat/chat.component';
import { SharedService } from './modules/shared/sharedService';
import { CreateProjectComponent } from './create-project/create-project.component';

import { DeleteUserDialog } from './students-list/students-list.component';
import { EditUserDialog } from './students-list/students-list.component';
import { ProjectsService} from './projects-list/projects.service';
import { EditProjectComponent } from './projects-list/edit-project/edit-project.component';
import { DeleteTaskDialog, TaskListComponent } from './projects-list/task-list/task-list.component';
import { EditListComponent } from './projects-list/task-list/edit-list/edit-list.component';
import { FileUploadComponent } from './projects-list/file-upload/file-upload.component';
import { CoreModule } from './modules/core.module';
import { UnauthorizedInterceptor } from './modules/interceptors/unauthorized.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent, 
    ProjectsListComponent,
    StudentsListComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    CreateProjectComponent,
  
    DeleteUserDialog,
    EditUserDialog,
    EditProjectComponent,
    DeleteProjectDialog,
    TaskListComponent,
    DeleteTaskDialog,
    EditListComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
 
    BrowserAnimationsModule,
    ClarityModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    CoreModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'projects', component: ProjectsListComponent, canActivate: [AuthorizeGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'chat', component: ChatComponent, canActivate: [AuthorizeGuard] },
    { path: 'students', component: StudentsListComponent, canActivate: [AuthorizeGuard] },
    { path: 'newproject', component: CreateProjectComponent, canActivate: [AuthorizeGuard] },
    { path: 'editproject/:id', component: EditProjectComponent, canActivate: [AuthorizeGuard], pathMatch: 'full' },
    { path: 'tasklist/:id', component: TaskListComponent, canActivate: [AuthorizeGuard], pathMatch: 'full' },
    { path: 'tasklist/edit/:id/:returnid', component: EditListComponent, canActivate: [AuthorizeGuard], pathMatch: 'full' },
    { path: 'uploadfile/:id', component: FileUploadComponent, canActivate: [AuthorizeGuard], pathMatch: 'full' }
], { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    SharedService,
    ProjectsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
