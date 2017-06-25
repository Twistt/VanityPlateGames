using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VPG.GAME.Models
{
    [DBTable("Comments")]
    public class Comment
    {
        [DBPrimaryKey]
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }
        public int UserId { get; set; }
        public int ImageId { get; set; }//Fileupload
        public int IsReplyTo { get; set; } //commentid
        public User user { get;set; }
    }
}