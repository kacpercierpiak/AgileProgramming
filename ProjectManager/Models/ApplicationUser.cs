using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models
{
    public enum Roles
    {
        Administrator,
        Teacher,
        Student
    }
    public class ApplicationUser : IdentityUser
    {
        public Roles role { get; set; } = Roles.Student;
    }
}
