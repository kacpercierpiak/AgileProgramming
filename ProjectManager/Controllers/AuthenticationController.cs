using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthenticationController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

  
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UsersRegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var defaultRole = Roles.Student;

            if (!_userManager.Users.Where(x => x.role == Roles.Administrator).Any() && request.UserName == "Administrator")
                defaultRole = Roles.Administrator;

            var user = new ApplicationUser
            {

                UserName = request.UserName,
                role = defaultRole


            };

            var result = await _userManager.CreateAsync(user, request.Password);


            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }

     
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            IQueryable<ApplicationUser> result = null;
            await Task.Run(() =>
            {
                result = _userManager.Users;
            });
            return Ok(result);
        }


       
        [HttpGet("User/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            ApplicationUser result = null;
            await Task.Run(() =>
            {
                result = _userManager.Users.Where(x => x.Id == id).FirstOrDefault();
            });
            return Ok(result);
        }
     
        [HttpPut("User")]
        public async Task<IActionResult> UserUpdate([FromBody] UserRoleUpdate request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null)
                return BadRequest("Cant find user");
            user.role = request.role;
            await _userManager.UpdateAsync(user);
            return Ok();
        }

      
       
        [HttpDelete("User/{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
                return BadRequest("Cant find user");
            await _userManager.DeleteAsync(user);
            return Ok();
        }
    }


    public class UsersRefreshRequest
    {
        public String RefreshToken { get; set; }

    }
    public class UserRoleUpdate
    {
        public String UserName { get; set; }
        public Roles role { get; set; }
    }
    public class UsersRegisterRequest
    {
        public String UserName { get; set; }
        public String Password { get; set; }
    }

    public class UsersLoginRequest
    {
        public String UserName { get; set; }
        public String Password { get; set; }
    }
}
