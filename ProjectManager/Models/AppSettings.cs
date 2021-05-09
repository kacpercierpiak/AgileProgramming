using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManager.Models
{
    public class AppSettings
    {
        public String Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public Int32 AccessTokenExpiration { get; set; }
        public Int32 RefreshTokenExpiration { get; set; }
    }
}
