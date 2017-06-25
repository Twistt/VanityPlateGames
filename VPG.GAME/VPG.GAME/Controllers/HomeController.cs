using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VPG.GAME.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {

            return View();
        }

        public ActionResult Press()
        {

            return View();
        }
        public ActionResult Privacy()
        {
            return View();
        }
        public ActionResult TermsOfService()
        {
            return View();
        }
    }
}