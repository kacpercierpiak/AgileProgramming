import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from './Project';
import { Observable } from 'rxjs';
import { Statuses, Task } from './task-list/task';
import { User } from 'src/app/Dto/User';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  public getProjets() {
    return this.http.get<Project[]>(`${environment.urls.api}projects`);
  }
  public update(project: Project){
    return this.http.put<Project[]>(`${environment.urls.api}projects/${project.projectId}`, project);
  }
  public getProjectDetails(id: number)
  {
    return this.http.get<Project>(`${environment.urls.api}projects/${id}`);
  }
  public delete(project: Project){
    return this.http.delete<Project[]>(`${environment.urls.api}projects/${project.projectId}`);
  }
  public addTask(task: Task){
    let name = task.name;
    
    let assignId = task.assignId;
    let deadLine = task.deadLine;    
    let projectId = task.projectId;
    let status = Statuses.New;

    return this.http.post(`${environment.urls.api}tasks`, {name,assignId,deadLine,projectId,status});
    
  }

  public updateTask(task: Task){
    let name = task.name;    
    let assignId = task.assignId;
    let deadLine = task.deadLine;    
    let projectId = task.projectId;
    let status = task.status;
    let taskid = task.taskId;

    return this.http.put(`${environment.urls.api}tasks/${taskid}`, {taskid,name,assignId,deadLine,projectId,status});
    
  }

  public GetTasks(id: number){   
    return this.http.get<Task[]>(`${environment.urls.api}tasks/project/${id}`,);
  }

  public getTaskDetails(id: number)
  {
    return this.http.get<Task>(`${environment.urls.api}tasks/${id}`,);
  }
  public deleteTask(task: Task){
    return this.http.delete<Task>(`${environment.urls.api}tasks/${task.taskId}`);
  }


}
