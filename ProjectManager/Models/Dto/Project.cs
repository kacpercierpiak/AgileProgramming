using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models.Dto
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime DeadLine { get; set; }
        public bool isActive { get; set; }
        public virtual ICollection<ProjectStudent> ProjectStudents { get; set; }
        public ICollection<Task> Tasks { get; set; }
    }
}
