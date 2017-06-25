using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VPG.GAME.Models
{
    [DBTable("Users")]
    public class User
    {

        public int Id { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastLogin { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public string ProfileImage { get; set; }
        public int ProfileImageId { get; set; }
        public string Title { get; set; }

        public DateTime Birthdate { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Token { get; set; }
        public DateTime LastActivty { get; set; }
        public string FacebookId { get; set; }

    }
}