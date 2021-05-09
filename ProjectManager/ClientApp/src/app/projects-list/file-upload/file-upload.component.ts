import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'app/students-list/students.service';
import { User } from '../../Dto/User'
import { Project } from '../Project';
import { ProjectsService } from '../projects.service';
import { FileUploadService } from './file-upload.service';
import { FileToUpload } from './FileToUpload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  public projectName: string = "";
  public description: string = "";
  public error: string = "";
  public theFile: any = null;

  public project: Project = new Project(0, "", "", new Date(""), true);

  onFileChange(event: any) {
    this.theFile = null;
    if (event.target.files && event.target.files.length > 0) {
      this.theFile = event.target.files[0];
    }
  }

  private readAndUploadFile(theFile: any) {
    let file = new FileToUpload();

    // Set File Information
    file.fileName = theFile.name;
    file.fileSize = theFile.size;
    file.fileType = theFile.type;
    file.lastModifiedTime = theFile.lastModified;
    file.lastModifiedDate = theFile.lastModifiedDate;

    // Use FileReader() object to get file to upload
    // NOTE: FileReader only works with newer browsers
    let reader = new FileReader();

    // Setup onload event for reader
    reader.onload = () => {
      // Store base64 encoded representation of file
      if (reader.result) {
        file.fileAsBase64 = reader.result.toString();
      }

      // POST to server
      this.uploadService.uploadFile(file).subscribe(() => {
        console.log("Upload complete");
      });
    }

    // Read the file
    reader.readAsDataURL(theFile);
  }

  uploadFile(): void {
    this.readAndUploadFile(this.theFile);
  }

  constructor(private route: ActivatedRoute, private uploadService: FileUploadService, private projectService: ProjectsService) { }
  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.projectService.getProjectDetails(Number(this.route.snapshot.paramMap.get('id'))).subscribe((data) => {
        this.project = data;
        this.projectName = data.name;
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
