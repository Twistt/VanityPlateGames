using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using ArachnidCreations.DevTools;
using VPG.GAME.Models;
namespace VPG.GAME
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //DAL.SExec(ORM.generateCreateSQL<User>());
            //DAL.SExec(ORM.generateCreateSQL<FileUpload>());
            //DAL.SExec(ORM.generateCreateSQL<Comment>());

            Cache.Comments = ORM.GetList<Comment>();
            Cache.FileUploads = ORM.GetList<FileUpload>();
            Cache.Users = ORM.GetList<User>();

        }
        void Application_BeginRequest(object sender, EventArgs e)
        {
            if (Common.BanList.Contains(Request.UserHostAddress.ToString()))
            {
                Response.StatusCode = 403;
                Response.End();
                //throw new HttpException(403, "Access Denied");
            }
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Cache-Control", "no-cache");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
                HttpContext.Current.Response.End();
            }
        }
    }
}
