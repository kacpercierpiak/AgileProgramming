import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from './project.service';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  public projectName: string = "";
  public description: string = "";
  public createDateTime: string = "";
  public deadline: string = "";
  public error: string = "";

  constructor(private projectService: ProjectService,private router: Router) { }

  ngOnInit(): void {
    this.createDateTime = new Date().toISOString();
  }

  public onSubmit() {
    this.error = "";
    if (this.projectName == "" || this.description == "" || this.createDateTime == "" || this.deadline == "") {
      alert("Fill the fields")
    } else {
      console.log(this.createDateTime);
      console.log(this.deadline);
      console.log(new Date(this.deadline));
      console.log(new Date(this.createDateTime));
      this.projectService.create(this.projectName, this.description, new Date(this.createDateTime), new Date(this.deadline), true).subscribe(() => {
        alert("Project added");
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
