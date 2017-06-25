using ArachnidCreations.DevTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VPG.GAME.Models
{
    [DBTable("FileUploads")]
    public class FileUpload
    {
        [DBPrimaryKey]
        public int Id { get; set; }
        public string FileName { get; set; }
        public int UploadedBy { get; set; } //userid
        public DateTime UploadDate { get; set; }
        public int FileSize { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Comment> Comments = new List<Comment>();
    }
}