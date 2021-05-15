import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectsService } from '../projects.service';
import { stringify } from '@angular/compiler/src/util';
import { Project } from '../Project';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  public projectName: string = "";
  public description: string = ""; 
  public deadline: string = "";
  public error: string = "";
  public project: Project = new Project(0,"","",new Date(""),true);
  

  constructor(private projectService: ProjectsService,private route: ActivatedRoute,private router: Router) { }
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id') != null)
    {
      this.projectService.getProjectDetails(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => {
        this.project = data;    
        this.projectName = this.project.name;
        this.deadline = data.deadLine.toString().split("T")[0];
        this.description = data.description;      
        
      }, (error: HttpErrorResponse) => {
        if (error && error.error) {
          this.error = error.error;
        }
        alert(this.error);
      });
    } 
    
  }

  public onSubmit() {
    this.error = "";
    this.project.deadLine = new Date(this.deadline);
    this.project.description = this.description;
    this.project.name = this.projectName;
     
    if (this.projectName == "" || this.description == ""  || this.deadline == "") {
      alert("Fill the fields")
    } else {
      this.projectService.update(this.project).subscribe(() => {
        alert("Project edited");
        this.router.navigate(["/projects"]);
      }, (error: HttpErrorResponse) => {
        if (error && error.error) {
          this.error = error.error;
        }
        alert(this.error);
      });
    }
  }
}
