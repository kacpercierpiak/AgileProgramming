import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from './project.service';
import { stringify } from '@angular/compiler/src/util';

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

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.createDateTime = new Date().toLocaleDateString();
  }

  public onSubmit() {
    this.error = "";
    if (this.projectName == "" || this.description == "" || this.createDateTime == "" || this.deadline == "") {
      alert("Fill the fields")
    } else {
      this.projectService.create(this.projectName, this.description, new Date(this.createDateTime), new Date(this.deadline), true).subscribe(() => {
        alert("Project added");
      }, (error: HttpErrorResponse) => {
        if (error && error.error) {
          this.error = error.error;
        }
        alert(this.error);
      });
    }
  }
}
