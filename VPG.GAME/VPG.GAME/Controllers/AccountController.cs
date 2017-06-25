using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPG.GAME.Models;

namespace VPG.GAME.Controllers
{
    public class AccountController : ApiController
    {
        // GET api/<controller>
        [HttpGet]
        public User AuthenticateAsFacebookUser(string userID, string name)
        {
            var header = ActionContext.Request.Headers.SingleOrDefault(x => x.Key == "Token");
            if (header.Value.FirstOrDefault() == null || header.Value.FirstOrDefault() == "") return null;
            var user = ORM.GetSingle<User>(null,"Users", userID, "facebookid");
            if (user == null)
            {
                var token = header.Value.FirstOrDefault();
                user = new User() { Active=true, Token = token, CreatedOn=DateTime.Now, LastActivty=DateTime.Now, UserName = name, FacebookId = userID, Name=name };
                var dtid= ORM.Insert(user, true);
                user.Id = int.Parse(dtid);
                return user;
            } else
            {
                user.Token = header.Value.FirstOrDefault();
                user.LastLogin = DateTime.Now;
                user.LastActivty = DateTime.Now;
                DAL.SExec(ORM.Update(user));

            }
            return user;
        }

    }
}