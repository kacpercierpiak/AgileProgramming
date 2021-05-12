using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models.Dto
{
    public enum Statuses
    {
        New,
        InProgress,
        Done
    }
    public class Task
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string assignId { get; set; }
        public DateTime DeadLine { get; set; }
        public int ProjectId { get; set; }
        public Statuses Status { get; set; }
        public Project Project { get; set; }

    }
    public class TaskDto : Task
    {
        public string assign { get; set; }

        public TaskDto(Task task)
        {
            this.assignId = task.assignId;
            this.DeadLine = task.DeadLine;
            this.Name = task.Name;
            this.ProjectId = task.ProjectId;
            this.Status = task.Status;
            this.TaskId = task.TaskId;
            this.Project = task.Project;
        }

    }
}
