
import { User } from "src/app/modules";
import { Project } from "../Project";
export enum Statuses {
    New,
    InProgress,
    Done
  }

export class Task {
    taskId?: Number;
    projectId: number;
    project: Project;
    name: string;
    assign?: User | string;  
    assignId?: String;
    deadLine: Date;
    status: Statuses;

    constructor( ProjectId: number,project:Project, Name: string, DeadLine: Date,status: Statuses, assign?:User,TaskId?:Number) {
        this.taskId = TaskId;
        this.projectId = ProjectId;
        this.name = Name;
        this.assign = assign;      
        this.deadLine = DeadLine;
        this.status = status;
        this.project = project;  
        this.assignId = assign?.id;   
    }
   

}