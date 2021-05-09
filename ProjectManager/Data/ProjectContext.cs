using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjectManager.Models.Dto;

namespace ProjectManager.Data
{
    public class ProjectContext : DbContext
    {
        public ProjectContext(DbContextOptions<ProjectContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<ProjectStudent>()
           .HasKey(e => new { e.ProjectId, e.StudentId });

            modelBuilder.Entity<Project>()
            .Property(f => f.ProjectId)
            .ValueGeneratedOnAdd();

            modelBuilder.Entity<Student>()
           .Property(f => f.StudentId)
           .ValueGeneratedOnAdd();

            modelBuilder.Entity<Models.Dto.Task>()
            .Property(f => f.TaskId)
            .ValueGeneratedOnAdd();


            //If you name your foreign keys correctly, then you don't need this.
            modelBuilder.Entity<ProjectStudent>()
                .HasOne<Project>(pt => pt.Project)
                .WithMany(p => p.ProjectStudents);


            modelBuilder.Entity<ProjectStudent>().HasOne<Student>(pt => pt.Student).WithMany(t => t.ProjectStudents);


            base.OnModelCreating(modelBuilder);


        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Models.Dto.Task> Tasks { get; set; }
        public DbSet<ProjectStudent> ProjectStudent { get; set; }


    }
}
