import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/projects-list/Project';
import { ProjectsService } from 'src/app/projects-list/projects.service';
import { StudentsService } from 'src/app/students-list/students.service';
import { User } from 'src/app/Dto/User';
import { Statuses, Task } from '../task';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  public name:string = "";
  public deadline: string = "";
  public assign?: String = "";
  public keys: string[] = [];
  public ActualStatus: number = 0;
  public error: string = "";
  public users : User[] =[]
  public ProjectId: number = 0;
  public statuses = Statuses;

  public project: Project = new Project(0,"","",new Date(""),true);
  public task: Task = new Task(0,this.project,"",new Date(""),0);
  constructor(private projectService: ProjectsService,private route: ActivatedRoute,private router: Router,private studentsService: StudentsService) {
    this.keys = Object.keys(Statuses).filter(k => !isNaN(Number(k)));

   }

  ngOnInit(): void {
    this.ProjectId = Number(this.route.snapshot.paramMap.get('returnid'));
    this.studentsService.getUsers().subscribe((data) => {
      this.users = data;
    },
      (error) => console.log(error));

    if(this.route.snapshot.paramMap.get('id') != null)
    {
      this.projectService.getTaskDetails(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => {
        this.task = data;
        console.dir(this.project.deadLine);
        this.name = data.name;
        this.deadline = data.deadLine.toString();
        this.assign = data.assignId;
        this.ActualStatus = data.status;
     
        
      }, (error: HttpErrorResponse) => {
        if (error && error.error) {
          this.error = error.error;
        }
        alert(this.error);
      });
    } 
  }
  public errors: string[] = [""];
  onSubmit(): void {
    this.task.name = this.name;
    this.task.assignId = this.assign;    
    this.task.status = this.ActualStatus;
    this.task.projectId = this.ProjectId;

      if (this.task) {

        if (this.task.name && this.task.deadLine) {
          console.dir(this.task);
        this.projectService.updateTask(this.task).subscribe(() => {
          this.router.navigate(["/tasklist/" + this.ProjectId]);
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

}
