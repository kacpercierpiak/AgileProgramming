using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models.Dto
{
    public class Student
    {
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IndexNo { get; set; }
        public string email { get; set; }
        public bool FullTime { get; set; }
        public virtual ICollection<ProjectStudent> ProjectStudents { get; set; }
    }
}
