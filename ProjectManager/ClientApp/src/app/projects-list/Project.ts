export class Project {
    projectId: number;
    name: string;
    description: string;
    createDateTime?: Date;
    deadLine: Date;
    isActive: boolean;

    constructor(ProjectId: number, Name: string, Description: string, DeadLine: Date, isActive: boolean, CreateDateTime?: Date) {
        this.projectId = ProjectId;
        this.name = Name;
        this.description = Description;
        this.createDateTime = CreateDateTime;
        this.deadLine = DeadLine;
        this.isActive = isActive;
    }

}