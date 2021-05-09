import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { StudentsService } from 'app/students-list/students.service';
import { map } from 'rxjs/operators';
import { User } from '../../Dto/User';
import { Project } from '../Project';
import { ProjectsService } from '../projects.service';
import { Statuses, Task } from './task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  public projectName: string = "";
  public description: string = ""; 
  public deadline: string = "";  
  public error: string = "";
  public inputName: string = "";
  public inputUserId: string = "";
  public inputDeadline: string = "";
  public users : User[] =[]

  public project: Project = new Project(0,"","",new Date(""),true);

  displayedColumns: string[] = ['No', 'Name', 'Assign', 'DeadLine', 'Status','settings'];
  dataSource = new MatTableDataSource<Task>();
  statuses = Statuses;
  public currentUser: User = new User(0,"","","");
  disableButtons: boolean = true;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  public errors: string[] = [""];

  public task = new Task(0,this.project,"",new Date(""),Statuses.New)

  AddTask(): void {     
    this.task.name = this.inputName;
    this.task.assignId = this.inputUserId;
    this.inputName = "";
    this.task.project = this.project;
    this.task.status = Statuses.New;

      if (this.task) {

        if (this.task.name && this.task.deadLine) {
          console.dir(this.task);
        this.projectService.addTask(this.task).subscribe(() => {
          this.projectService.GetTasks(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => 
          {
            this.dataSource = new MatTableDataSource(Array.from(data));
          });
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
          alert("You have to fill the fields");
        }
      }
  
  }
  openDeleteDialog(task: Task) {    
    if(!this.disableButtons)
    {
    const dialogRef = this.dialog.open(DeleteTaskDialog, {
      width: '250px',
      data: task
    });          
  }
  
}
openEditDialog(task: Task) {    
  if(!this.disableButtons || task.assignId === this.currentUser.id || task.assign === "" )
  {    
    this.router.navigate(['/tasklist/edit',task.taskId,task.projectId]);       
}

}
  

  constructor(private projectService: ProjectsService,private route: ActivatedRoute,private router: Router, private dialog: MatDialog,private studentsService: StudentsService,private authService: AuthenticationService) { }
  ngOnInit(): void {

    this.authService.user$.pipe(
      map((user) => {
       
        if (user) {        
        
          this.currentUser = user;
          this.inputUserId = user.id;          
          if(this.currentUser.role!=2)
          this.disableButtons = false;
          return true;        
        } else return false;
      })      
    ).subscribe();

this.task.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentsService.getUsers().subscribe((data) => {
      this.users = data;
    },
      (error) => console.log(error));


    if(this.route.snapshot.paramMap.get('id') != null)
    {
      this.projectService.GetTasks(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => 
      {
        this.dataSource = new MatTableDataSource(Array.from(data));
      });
      this.projectService.getProjectDetails(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => {
        this.project = data;
        console.dir(this.project.deadLine);
        this.projectName = this.project.name;
        this.deadline = data.deadLine.toString();
        this.description = data.description;
        
      }, (error: HttpErrorResponse) => {
        if (error && error.error) {
          this.error = error.error;
        }
        alert(this.error);
      });
    }    
    
  }

  

}


@Component({
  selector: 'delete-task-dialog',
  templateUrl: 'delete-task-dialog.html',
})
export class DeleteTaskDialog {
  public errors: string[] = [""];

  constructor(private projectsService: ProjectsService,
    private dialogRef: MatDialogRef<DeleteTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeTask(task: Task) {
    
    console.dir(task);
    this.dialogRef.close();
    if (task) {
      this.projectsService.deleteTask(task).subscribe(() => {
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

