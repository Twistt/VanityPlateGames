using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;
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
            var user = ORM.GetSingle<User>(null, "Users", userID, "facebookid");
            if (user == null)
            {
                var token = header.Value.FirstOrDefault();
                user = new User() { Active = true, Token = token, CreatedOn = DateTime.Now, LastActivty = DateTime.Now, UserName = name, FacebookId = userID, Name = name };
                var dtid = ORM.Insert(user, true);
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
        public string FacebookLoginCallback(string access_token, int expires_in)
        {
            Console.WriteLine(access_token);
            Console.WriteLine(expires_in);
            //http://localhost:53322/play?#access_token=EAAboNsJLXwoBAMKxHNH5Jf0ZCK4XDTGmArZCP5hwokobvZCbpVTb12a939cLkryyIQmPbMRkc94Qn5mh9nPy1rkMDsPf6hNuyKB1GurAWmMWLpzFG46BoNStYS524biewai1OXQZA9CX3TfbbnZAVRZC6BvYQ0ZBIMZD&expires_in=5179484
            return "";

        }
        public string FacebookGetGraphMe(string fbid)
        {

            https://graph.facebook.com/v2.9/me/?client_id=1944171745861386&access_token=EAAboNsJLXwoBAMKxHNH5Jf0ZCK4XDTGmArZCP5hwokobvZCbpVTb12a939cLkryyIQmPbMRkc94Qn5mh9nPy1rkMDsPf6hNuyKB1GurAWmMWLpzFG46BoNStYS524biewai1OXQZA9CX3TfbbnZAVRZC6BvYQ0ZBIMZD
            return "";
        }
    }
}