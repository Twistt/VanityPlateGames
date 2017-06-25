using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VPG.GAME.Models;

namespace VPG.GAME
{
    public class Common
    {
        public static List<string> BanList = new List<string>();
        public static User GetUserFromHeader(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            var host = actionContext.Request.RequestUri.Host;

            var header = actionContext.Request.Headers.SingleOrDefault(x => x.Key == "Token");
            var token = header.Value.FirstOrDefault();
            User user = ORM.GetSingle<User>(null,"Users",token, "Token");
            if (user != null) return user;
            else return null;
        }
        public static User GetUserFromHeader(System.Web.Mvc.ControllerContext actionContext)
        {
            var host = actionContext.RequestContext.HttpContext.Request.Url.Host;
            var token = actionContext.RequestContext.HttpContext.Request.Headers.Get("Token");
            User user = ORM.GetSingle<User>(null, "Users", token, "Token");
            if (user != null) return user;
            else return null;
        }
    }
}