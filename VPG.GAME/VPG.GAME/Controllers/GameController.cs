using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Web.Http;
using VPG.GAME.Models;
using ArachnidCreations.DevTools;
using System.Web.Http.Cors;

namespace VPG.GAME.Controllers
{
    public class GameController : ApiController
    {
        // GET: Game
        [System.Web.Mvc.HttpPost]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public HttpResponse PostFormData()
        {
            var user = Common.GetUserFromHeader(ActionContext);
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var name = httpRequest.Form["Name"];
            var desc = httpRequest.Form["Description"];

            if (user == null) return null;
            if (httpRequest.Files.Count > 0)
            {
                if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Uploads/"))) Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Uploads/"));
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var ufile = new FileUpload() { FileName = postedFile.FileName, FileSize = postedFile.ContentLength, UploadedBy = user.Id, UploadDate = DateTime.Now, Name = name, Description = desc };
                    var id = int.Parse(ORM.Insert(ufile, true));
                    ufile.Id = id;
                    var filePath = HttpContext.Current.Server.MapPath("~/Uploads/" + ufile.Id +"_"+ postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    Cache.FileUploads.Add(ufile);

                }
                result = Request.CreateResponse(HttpStatusCode.Created);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return null;
        }
        public FileUpload GetRandomImage()
        {
            var user = Common.GetUserFromHeader(ActionContext);
            if (user != null)
            {
                List<FileUpload> fu = ORM.convertDataTabletoObject<FileUpload>(DAL.SLoad("select top 1 * from Fileuploads order by newid();"));
                var fileimage = fu.FirstOrDefault();
                //List<Comment> comments = ORM.GetList<Comment>(null, "Comments", new Dictionary<string, string>() { { "ImageId", fileimage.Id.ToString() } });
                fileimage.Comments = Cache.Comments.Where(c => c.ImageId == fileimage.Id).ToList();
                return fileimage;
            }
            else return null;
        }
        public List<FileUpload> GetFilesByUser(string facebookid)
        {
            //ToDo: this be any user. not just the logged in user.
            var user = Common.GetUserFromHeader(ActionContext);
            if (user == null) return null;
//            List<FileUpload> fus = ORM.GetList<FileUpload>(null, "Fileuploads", new Dictionary<string, string>() { { "UploadedBy", user.Id.ToString() } });
            return Cache.FileUploads.Where(f => f.UploadedBy == user.Id).ToList();

        }
        public Comment CreateNewComment(Comment comment) {
            var user = Common.GetUserFromHeader(ActionContext);
            if (user == null) return null;
            comment.UserId = user.Id;
            var id = int.Parse(ORM.Insert(comment, true));
            comment.Id = id;
            Cache.Comments.Add(comment);
            comment.user = Cache.Users.Where(u => u.Id == comment.UserId).FirstOrDefault();
            return comment;
        }
        public List<Comment> GetCommentsByImageId(int id)
        {
            var user = Common.GetUserFromHeader(ActionContext);
            if (user == null) return null;
            //List<Comment> comments = ORM.GetList<Comment>(null, "Comments", new Dictionary<string, string>() { { "ImageId", id.ToString() } });
            //return comments;
            
            var comments =  Cache.Comments.Where(c => c.ImageId == id).ToList();
            foreach (var comment in comments)
            {
                comment.user = Cache.Users.Where(u=>u.Id == comment.UserId).FirstOrDefault();
            }
            return comments;
            
        }
        
    }
}