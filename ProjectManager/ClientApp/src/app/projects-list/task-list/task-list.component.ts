import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentsService } from 'src/app/students-list/students.service';
import { User } from '../../Dto/User';
import { Project } from '../Project';
import { ProjectsService } from '../projects.service';
import { Statuses, Task } from './task';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { Board } from './models/Board';
import { Column } from './models/Column';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})



export class TaskListComponent implements OnInit {
  public board: Board = new Board('Test Board', [
    new Column('New', '1', []),
    new Column('In Progress', '2', []),
    new Column('Done', '3', [])
  ]);

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
  disableButtons: boolean = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  public errors: string[] = [""];

  public task = new Task(0, this.project, "", new Date(""), Statuses.New);
  public dropGrid(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex);
  }

  public drop(event: CdkDragDrop<Task[]>): void {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
      
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

        let task = event.container.data[event.currentIndex];
        console.log(task);
      switch(event.container.id)
      {
        case '1':
          task.status = Statuses.New;
          break;
        case '2':
          task.status = Statuses.InProgress;
          break;
        case '3':
          task.status = Statuses.Done;
          break;
      }
      this.Save(task);
    }
  }

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
          this.refreshData();
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

  Save(task:Task): void { 
        this.projectService.updateTask(task).subscribe(() => {

          }, (error: HttpErrorResponse) => {           
            alert(error.message);
          });
        }   
  
  openDeleteDialog(task: Task) {    
    
    const dialogRef = this.dialog.open(DeleteTaskDialog, {
      width: '250px',
      data: task
    });    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refreshData();
    });      
  
  
}
openEditDialog(task: Task) {    
    
    this.router.navigate(['/tasklist/edit',task.taskId,task.projectId]);       


}
  

  constructor(private projectService: ProjectsService,private route: ActivatedRoute,private router: Router, private dialog: MatDialog,private studentsService: StudentsService,private authService: AuthenticationService) { }
  ngOnInit(): void {
   

this.task.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentsService.getUsers().subscribe((data) => {
      this.users = data;
    },
      (error) => console.log(error));


    if(this.route.snapshot.paramMap.get('id') != null)
    {
        this.refreshData();
    }    
    
  }

  refreshData(){
    this.projectService.GetTasks(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data : Task[]) => 
    {
      this.dataSource = new MatTableDataSource(Array.from(data));
      let taskNew : Task[] = [];
      let taskInProgress : Task[] = [];
      let taskDone: Task[] = [];
      data.forEach((value)=>{
        switch(value.status){
          case Statuses.New:           
              taskNew.push(value);
              break;
          case Statuses.InProgress:           
              taskInProgress.push(value);
              break;
          case Statuses.Done:           
              taskDone.push(value);
              break;            
        }
      });
      this.board.columns[0].tasks = taskNew;
      this.board.columns[1].tasks = taskInProgress;
      this.board.columns[2].tasks = taskDone;
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

