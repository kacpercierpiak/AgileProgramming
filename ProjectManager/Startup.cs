using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ProjectManager.ConfigService;
using ProjectManager.Data;
using ProjectManager.Models;
using ProjectManager.Services;
using System;


namespace WebApplication1
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("https://agileprogramming.herokuapp.com",
                                                          "http://agileprogramming.herokuapp.com").AllowAnyHeader().AllowCredentials(); 
                                  });
            });
            DbCredentials connectionString = new DbCredentials();

            services.AddDbContext<ProjectContext>(options =>
            options.UseNpgsql(connectionString.GetDBConnectionString(), options => options.SetPostgresVersion(new Version(11, 9))));
            services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString.GetDBConnectionString(), options => options.SetPostgresVersion(new Version(11, 9))));

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddSignalR();
            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddAuthentication().AddGoogle(options =>
            {
                options.ClientId = Environment.GetEnvironmentVariable("GoogleClientId");
                options.ClientSecret = Environment.GetEnvironmentVariable("GoogleClientSecret");
            });

            services.AddAuthentication().AddFacebook(options =>
            {
                options.AppId = Environment.GetEnvironmentVariable("FacebookClientId");
                options.ClientSecret = Environment.GetEnvironmentVariable("FacebookClientSecret");
            });

            services.AddControllersWithViews();
            services.AddRazorPages();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
              
            }

            app.UseCors(MyAllowSpecificOrigins);
            app.UseStaticFiles();         

            if (Environment.GetEnvironmentVariable("PORT") != null)
            {
                app.UseSpaStaticFiles();
            }


                app.UseRouting();
          
            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
                
                endpoints.MapHub<ChatHubService>("/api/chatsocket");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    if(Environment.GetEnvironmentVariable("PORT")==null)
                        spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
