using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ProjectManager.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ProjectContext>();
                db.Database.Migrate();

                var userdb = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                userdb.Database.Migrate();


            }
            host.Run();
            CreateHostBuilder(args).Build().Run();
            
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var port = "5001";
                    var url = "https://*:";
                    if (Environment.GetEnvironmentVariable("PORT") != null)
                    {
                        port = Environment.GetEnvironmentVariable("PORT");
                        url = "http://*:";
                    }
                   
                    

                    webBuilder.UseStartup<Startup>()
                    .UseUrls(url + port);
                });
    }
}
