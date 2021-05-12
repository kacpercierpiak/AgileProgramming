using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ProjectManager.Data;
using ProjectManager.Models;
using ProjectManager.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppSettings _appSettings;
        private readonly ApplicationDbContext _dataContext;

        public TasksController(ProjectContext context, UserManager<ApplicationUser> userManager,
     SignInManager<ApplicationUser> signInManager,
     IOptions<AppSettings> appSettings,
     ApplicationDbContext dataContext)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _dataContext = dataContext;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Dto.Task>>> GetTasks()
        {
            return await _context.Tasks.ToListAsync();
        }
        [HttpGet("project/{id}")]
        public async Task<ActionResult<Models.Dto.TaskDto>> GetTaskByProject(int id)
        {
            var task = await _context.Tasks.Where(x => x.ProjectId == id).ToListAsync();
            var result = new List<TaskDto>();

            task.ForEach(x =>
            {
                var u = _userManager.Users.Where(c => c.Id == x.assignId).FirstOrDefault();
                var ass = u == null ? "" : u.UserName;

                result.Add(new TaskDto(x) { assign = ass });
            });


            if (task == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Dto.TaskDto>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);


            var u = _userManager.Users.Where(c => c.Id == task.assignId).FirstOrDefault();
            var ass = u == null ? "" : u.UserName;

            var result = (new TaskDto(task) { assign = ass });

            if (task == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        // PUT: api/Tasks/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
      
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, Models.Dto.Task task)
        {
            Models.Dto.Task taskResult = null;
            if (id != task.TaskId)
            {
                return BadRequest();
            }      

            if (taskResult != null)
            {
                _context.Entry(taskResult).State = EntityState.Detached;
            }

            _context.Entry(task).State = EntityState.Modified;


            try
            {

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tasks
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
       
        [HttpPost]
        public async Task<ActionResult<Models.Dto.Task>> PostTask(Models.Dto.Task task)
        {

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTask", new { id = task.TaskId }, task);
        }

        // DELETE: api/Tasks/5
       
        [HttpDelete("{id}")]
        public async Task<ActionResult<Models.Dto.Task>> DeleteTask(int id)
        {
           var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return task;
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}
