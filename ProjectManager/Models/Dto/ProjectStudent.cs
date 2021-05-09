using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models.Dto
{
    public class ProjectStudent
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
    }
}
