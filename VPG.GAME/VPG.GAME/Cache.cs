using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VPG.GAME.Models;

namespace VPG.GAME
{
    public class Cache
    {
        public static List<User> Users = new List<User>();
        public static List<Comment> Comments = new List<Comment>();
        public static List<FileUpload> FileUploads = new List<FileUpload>();
    }
}