import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from './projects.service'
import { Project } from './Project';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/services/authentication.service';
import { map } from 'rxjs/operators';
import { User } from 'app/Dto/User';


@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  displayedColumns: string[] = ['ProjectId', 'Name', 'Description', 'CreateDateTime', 'DeadLine','settings'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public currentUser: User = new User(0,"","","");
  disableButtons: boolean = true;
  projects: Project[] = [];

  dataSource = new MatTableDataSource<Project>();
  constructor(private projectsService: ProjectsService, private dialog: MatDialog,private authService: AuthenticationService) {

  }

  ngOnInit(): void {
   
    this.authService.user$.pipe(
      map((user) => {
       
        if (user) {        
        
          this.currentUser = user;
          if(this.currentUser.role!=2)
          this.disableButtons = false;
          return true;        
        } else return false;
      })      
    ).subscribe();

    
    this.projectsService.getProjets().subscribe((data) => {
      this.projects = data;
      console.dir(data);
      this.dataSource = new MatTableDataSource(Array.from(this.projects));
      this.dataSource.paginator = this.paginator;     
 
    },
      (error) => console.log(error)
      );

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDeleteDialog(project: Project) {
    if(!this.disableButtons)
    {    
      const dialogRef = this.dialog.open(DeleteProjectDialog, {
        width: '250px',
        data: project
      });       
    }   
    
  }




}

@Component({
  selector: 'delete-project-dialog',
  templateUrl: 'delete-project-dialog.html',
})
export class DeleteProjectDialog {
  public errors: string[] = [""];

  constructor(private projectsService: ProjectsService,
    
    private dialogRef: MatDialogRef<DeleteProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Project) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeProject(project: Project) {
    
    console.dir(project);
    this.dialogRef.close();
    if (project) {
      this.projectsService.delete(project).subscribe(() => {
        window.location.reload();
      }, (error: HttpErrorResponse) => {
        if (error.error instanceof Array) {
          this.errors = error.error.map(m => m.description);
        }
        else {
          this.errors = [error.error.message];
        }
        alert(this.errors.join("\n"));
      });
    } else {
      alert("User not found");
    }
  }

}


